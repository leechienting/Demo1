# async/await（非同步等待機制）

## 1\. 概念名稱

**async/await（非同步等待機制）**

## 2\. 這是什麼？

想像你在咖啡店點了一杯咖啡，你有兩種選擇：第一種是站在櫃檯前傻傻等著咖啡做好，什麼都不做；第二種是拿到號碼牌後去找位子坐下滑手機，等叫號了再去拿。async/await 就像是第二種方式，它讓你的程式在等待某件事情完成時（比如從網路下載資料），不會整個卡住，而是可以先去做其他事情，等資料回來了再繼續處理。

在 iOS 開發中，async/await 是 Swift 5.5 引入的現代化非同步程式設計語法，它讓原本需要用 closure（閉包）、callback（回呼）來處理的非同步操作，變得像寫同步程式一樣直觀易讀。

## 3\. 為什麼重要？

### 解決了什麼問題？

在 async/await 出現之前，iOS 開發者面臨幾個痛點：

**回呼地獄（Callback Hell）**：當你需要連續執行多個非同步操作時，程式碼會變成層層巢狀的 closure，難以閱讀和維護。例如：先登入、再取得用戶資料、再下載頭像，每一步都要等前一步完成。

**錯誤處理混亂**：每個 closure 都要處理自己的錯誤，導致 error handling 散落各處，容易遺漏。

**記憶體管理陷阱**：closure 容易造成 retain cycle（循環引用），需要小心處理 `[weak self]`，稍不注意就記憶體洩漏。

**執行緒切換複雜**：要在背景執行緒做事，然後切回主執行緒更新 UI，需要手動管理 DispatchQueue，容易出錯。

### 不用它會怎樣？

如果不使用 async/await，你的程式碼可能會：

- 充滿巢狀的 completion handler，難以追蹤程式流程

- 需要手動管理執行緒切換，容易造成主執行緒阻塞或 UI 更新錯誤

- 錯誤處理分散在各個 callback 中，難以統一管理

- 更容易出現 race condition（競態條件）和記憶體問題

## 4\. 關鍵機制有哪些？

### async（非同步函式標記）

標記一個函式是非同步的，表示它可能會暫停執行並在未來某個時間點恢復。

### await（等待關鍵字）

用來等待一個非同步操作完成，在等待期間會暫停當前函式的執行，但不會阻塞執行緒。

### Task（任務）

Swift Concurrency 的基本執行單位，代表一個非同步工作的上下文。每個非同步操作都在某個 Task 中執行。

### Actor（行為者模型）

一種特殊的參考型別，保證其內部狀態的存取是執行緒安全的，避免 data race。

### MainActor

一個特殊的 global actor，保證程式碼在主執行緒上執行，用於更新 UI。

### Continuation（延續）

用於橋接舊有的 callback-based API 到新的 async/await 世界，像是把 completion handler 轉換成 async 函式。

### Structured Concurrency（結構化並發）

透過 async let、TaskGroup 等機制，讓並發任務的生命週期與程式結構綁定，確保所有子任務都會被正確管理和取消。

## 5\. 如何運作？

### 核心運作機制

**暫停點（Suspension Points）**： 當程式執行到 `await` 時，Swift 會在此處設置一個暫停點。函式會暫停執行，釋放當前執行緒，讓它可以去做其他工作。等非同步操作完成後，Swift runtime 會選擇一個合適的執行緒恢復執行。

**協程（Coroutines）**： async/await 的底層實作是協程機制。編譯器會將 async 函式轉換成狀態機，每個 await 點都是一個狀態轉換。這讓函式可以在不同狀態間切換，而不需要保留整個呼叫堆疊。

**執行緒池管理**： Swift runtime 維護一個協作式的執行緒池（cooperative thread pool）。當一個 Task 在 await 處暫停時，該執行緒可以被其他 Task 使用，實現高效的並發。

**優先級與取消**： 每個 Task 都有優先級（high、default、low 等），runtime 會根據優先級調度執行。Task 支援取消操作，可以透過 `Task.isCancelled` 檢查並提前結束不需要的工作。

**Sendable 協定**： 為了確保跨並發邊界傳遞資料的安全性，Swift 引入了 Sendable 協定。只有符合 Sendable 的型別才能在不同 Task 間安全傳遞。

## 6\. 實際例子

```swift
// 傳統 callback 方式
func fetchUserProfile(completion: @escaping (Result<User, Error>) -> Void) {
    APIClient.fetchUser { userResult in
        switch userResult {
        case .success(let user):
            APIClient.fetchAvatar(for: user.id) { avatarResult in
                switch avatarResult {
                case .success(let avatar):
                    let profile = User(user: user, avatar: avatar)
                    completion(.success(profile))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
        case .failure(let error):
            completion(.failure(error))
        }
    }
}

// 使用 async/await 改寫
func fetchUserProfile() async throws -> User {
    let user = try await APIClient.fetchUser()
    let avatar = try await APIClient.fetchAvatar(for: user.id)
    return User(user: user, avatar: avatar)
}

// 在 SwiftUI View 中使用
struct ProfileView: View {
    @State private var user: User?
    @State private var isLoading = false
    @State private var error: Error?
    
    var body: some View {
        VStack {
            if let user = user {
                UserProfileView(user: user)
            } else if isLoading {
                ProgressView()
            } else if let error = error {
                ErrorView(error: error)
            }
        }
        .task {
            isLoading = true
            defer { isLoading = false }
            
            do {
                user = try await fetchUserProfile()
            } catch {
                self.error = error
            }
        }
    }
}
```

## 7\. 工作中的連結

在你目前的 iOS 專案中，以下場景可能已經或應該使用 async/await：

**網路請求層**： 如果你的專案使用 URLSession，Apple 已經提供了 async/await 版本的 API。你可以將原本用 `dataTask(with:completionHandler:)` 的程式碼改寫為 `data(from:)` async 方法，讓網路層更簡潔。

**資料庫操作**： 如果使用 Core Data 或 Realm，複雜的查詢或寫入操作應該在背景執行，可以用 async/await 包裝這些操作，避免阻塞主執行緒。

**圖片載入與快取**： 載入遠端圖片、處理圖片壓縮等耗時操作，都是 async/await 的理想場景。可以讓 UI 保持流暢，同時用 Task 的取消機制處理 cell 重用時的圖片載入取消。

**使用者認證流程**： 登入、Token 刷新、生物辨識等認證流程通常涉及多個步驟，async/await 可以讓這些流程更容易理解和維護。

**並發資料獲取**： 如果需要同時從多個 API 獲取資料（例如首頁需要載入多個區塊的內容），可以用 `async let`或 TaskGroup 實現平行載入，大幅提升效能。

## 8\. 延伸問題

### 並發控制議題

如何控制同時執行的 Task 數量？當你需要載入 100 張圖片時，如何避免產生 100 個並發請求導致記憶體爆增？這涉及到 TaskGroup 的使用和自訂的並發限制器設計。

### 錯誤傳播策略

在複雜的非同步呼叫鏈中，如何優雅地處理和傳播錯誤？是讓錯誤自動向上拋出，還是在某些層級捕獲並轉換成更具語義的錯誤型別？

### 與舊有 API 整合

專案中大量使用 callback-based API（如第三方 SDK），如何用 Continuation 橋接到 async/await？需要注意哪些陷阱（例如 continuation 必須恰好被呼叫一次）？

### 測試策略

如何測試使用 async/await 的程式碼？如何在單元測試中控制非同步操作的時序？Swift 的 `@MainActor` 在測試環境中如何正確處理？

### 效能優化

async/await 雖然方便，但每個 await 點都是潛在的執行緒切換點。在效能敏感的場景（如滑動列表時的快速載入），如何平衡程式碼可讀性與效能？

### Actor 隔離與資料共享

當多個 View 或 ViewModel 需要共享同一個 Actor 管理的狀態時，如何設計架構避免死鎖（deadlock）或過度等待？

## 9\. 未來研究方向

**Swift Concurrency 的進階模式**： 深入研究 Distributed Actor（分散式行為者）、CustomExecutor（自訂執行器）等進階功能，這些對於構建大型、複雜的並發系統很有幫助。

**Async Sequences（非同步序列）**： 探索 AsyncStream、AsyncThrowingStream 等非同步序列的使用，這對於處理持續產生的事件流（如 WebSocket、Notification Center）非常有用。

**Combine 與 async/await 的整合**： 雖然 async/await 更現代，但 Combine 在處理複雜的資料流轉換時仍有優勢。研究如何將兩者結合，發揮各自優點。

**跨平台並發模型**： 了解其他平台（Android 的 Kotlin Coroutines、JavaScript 的 async/await）的並發模型，可以幫助你更深入理解 Swift Concurrency 的設計哲學和權衡。

**編譯器優化**： 研究 Swift 編譯器如何將 async/await 轉換為實際的機器碼，了解 inline、特化等優化技術如何影響非同步程式的效能。

**實戰模式與最佳實踐**： 建立自己的非同步架構模式庫，例如：可取消的請求管理器、批次操作協調器、優先級佇列等，累積實戰經驗。

---

**歸類**：併發程式設計（Concurrency）/ 非同步程式設計（Asynchronous Programming）

**字數統計**：約 2,050 字

---

這篇文章的精髓在於理解：async/await 不只是語法糖，而是一整套並發程式設計的思維轉變。它讓非同步程式設計從「如何管理回呼」變成「如何結構化並發任務」，這是質的飛躍。正如那篇文章作者每天花 2 小時深入學習一樣，真正掌握 async/await，需要在實際專案中不斷實踐、踩坑、反思，才能從「會用」進階到「精通」。