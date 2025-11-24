# **Swift 閉包逃逸(**Escaping**)機制：記憶體管理的關鍵戰場**

## **1\. 概念名稱**

**逃逸閉包（Escaping Closure）與非逃逸閉包（Non-Escaping Closure）**

## **2\. 這是什麼？**

想像你今天委託朋友幫你辦事。**非逃逸閉包**就像是「你站在旁邊看著朋友當場辦完」，事情結束了你們就散了；**逃逸閉包**則像是「朋友說我晚點幫你辦，你先走」，這件事會延後執行，甚至可能在你離開後才完成。

在 Swift 中，閉包（Closure）是一段可以被傳遞和呼叫的程式碼區塊。當這個閉包在函式返回「之後」才執行，我們就說它「逃逸」了；如果它在函式返回「之前」就執行完畢，那就是「非逃逸」的。

從 Swift 3 開始，閉包預設是**非逃逸**的，如果需要逃逸行為，必須明確標註 `@escaping`。

## **3\. 為什麼重要？**

### **解決的問題：**

1. **記憶體管理**：逃逸閉包會捕獲（capture）外部變數，容易造成循環引用（retain cycle）導致記憶體洩漏

2. **執行時機控制**：明確區分同步與非同步操作的語意

3. **編譯器最佳化**：非逃逸閉包讓編譯器可以做更多記憶體最佳化

4. **程式碼可讀性**：一眼看出函式是否會延遲執行某些邏輯

### **不用會怎樣？**

- 無法正確處理非同步操作（網路請求、動畫完成回調）

- 容易寫出記憶體洩漏的程式碼

- 無法理解為何有些地方需要寫 `[weak self]` 或 `[unowned self]`

   - [弱引用 (Weak Reference).md](./弱引用%20\(Weak%20Reference\).md),[無主引用 (Unowned Reference).md](./無主引用%20\(Unowned%20Reference\).md)

- 在使用 GCD、DispatchQueue、UIView.animate 等 API 時會感到困惑

## **4\. 關鍵機制有哪些？**

### **核心定義：**

**非逃逸閉包（Non-Escaping）**

- Swift 3+ 的預設行為

- 閉包的生命週期不會超過函式作用域

- 在函式返回前必須執行完畢

- 編譯器可以做更積極的最佳化

**逃逸閉包（Escaping）**

- 需要明確標註 `@escaping` 關鍵字

- 閉包可能在函式返回後才執行

- 常見於非同步操作、completion handlers

- 必須謹慎處理記憶體管理

### **相關專有名詞：**

**捕獲列表（Capture List）**

```
{ [weak self, unowned manager] in ... }
```

控制閉包如何捕獲外部變數的參考方式

**Strong Reference Cycle（強參考循環）** 當物件 A 持有物件 B，B 又持有 A，導致雙方都無法被釋放

**weak vs unowned**

- `weak`：可選型別，參考的物件可能變成 `nil`

- `unowned`：非可選型別，假設參考的物件一定存在

   - [弱引用 (Weak Reference).md](./弱引用%20\(Weak%20Reference\).md),[無主引用 (Unowned Reference).md](./無主引用%20\(Unowned%20Reference\).md)

## **5\. 如何運作？**

### **核心運作機制：**

**非逃逸閉包的記憶體配置：**

```swift
func processData(completion: (String) -> Void) {
    let data = "Hello"
    completion(data)  // 在函式返回前執行
}  // completion 在此處被釋放
```

編譯器知道 `completion` 不會逃逸，可以將閉包配置在棧（Stack）上，效能更好。

**逃逸閉包的記憶體配置：**

```swift
var completionHandlers: [() -> Void] = []
​
func storeCompletion(handler: @escaping () -> Void) {
    completionHandlers.append(handler)  // 閉包被存儲起來
}  // 函式返回但 handler 仍然存在
```

閉包必須配置在堆（Heap）上，因為它的生命週期超過了函式作用域。

### **記憶體管理流程：**

```swift
class NetworkManager {
    var onComplete: (() -> Void)?
    
    func fetchData(completion: @escaping (Data?) -> Void) {
        DispatchQueue.global().async {
            // 網路請求...
            let data = Data()
            
            DispatchQueue.main.async {
                completion(data)  // 在未來某個時間點執行
            }
        }
    }
}

class ViewController: UIViewController {
    let manager = NetworkManager()
    
    func loadData() {
        // ❌ 錯誤：造成循環引用
        manager.fetchData { data in
            self.updateUI()  // self -> manager -> closure -> self
        }
        
        // ✅ 正確：使用 weak self
        manager.fetchData { [weak self] data in
            self?.updateUI()
        }
    }
}
```

## **6\. 實際例子**

### **場景：實作一個圖片下載管理器**

```swift
class ImageDownloader {
    // 儲存所有進行中的下載任務
    private var downloadTasks: [URL: [(UIImage?) -> Void]] = [:]
    
    // completion 是逃逸閉包，因為網路請求是非同步的
    func downloadImage(from url: URL, 
                      completion: @escaping (UIImage?) -> Void) {
        
        // 檢查是否已經有相同的下載任務
        if var existingCallbacks = downloadTasks[url] {
            existingCallbacks.append(completion)
            downloadTasks[url] = existingCallbacks
            return
        }
        
        // 創建新的下載任務
        downloadTasks[url] = [completion]
        
        URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
            defer {
                // 確保清理任務列表
                self?.downloadTasks[url] = nil
            }
            
            let image = data.flatMap { UIImage(data: $0) }
            
            // 通知所有等待的回調
            DispatchQueue.main.async {
                self?.downloadTasks[url]?.forEach { callback in
                    callback(image)
                }
            }
        }.resume()
    }
    
    // processImage 是非逃逸閉包，因為它立即執行
    func processImageSync(image: UIImage, 
                         filter: (UIImage) -> UIImage) -> UIImage {
        return filter(image)  // 在函式返回前執行完畢
    }
}

// 使用範例
class ProfileViewController: UIViewController {
    let downloader = ImageDownloader()
    @IBOutlet weak var avatarImageView: UIImageView!
    
    func loadAvatar() {
        guard let url = URL(string: "https://example.com/avatar.jpg") else { return }
        
        // ✅ 使用 weak self 避免循環引用
        downloader.downloadImage(from: url) { [weak self] image in
            guard let self = self, let image = image else { return }
            
            // 使用非逃逸閉包進行同步處理
            let processedImage = self.downloader.processImageSync(image: image) { img in
                // 這裡不需要 [weak self]，因為是非逃逸閉包
                return self.applyRoundedCorners(to: img)
            }
            
            self.avatarImageView.image = processedImage
        }
    }
    
    private func applyRoundedCorners(to image: UIImage) -> UIImage {
        // 圖片處理邏輯...
        return image
    }
}
```

## **7\. 工作中的連結**

在你目前的 iOS 專案中，這些地方可能都涉及逃逸與非逃逸閉包：

### **可能使用逃逸閉包的場景：**

- **網路層**：API 請求的 completion handlers

- **動畫**：`UIView.animate(withDuration:animations:completion:)` 的 completion

- **資料庫操作**：Core Data 或 Realm 的非同步查詢回調

- **Delegate 替代方案**：使用閉包實作回調機制

- **GCD/DispatchQueue**：`DispatchQueue.main.async { ... }`

### **可能使用非逃逸閉包的場景：**

- **集合操作**：`map`、`filter`、`reduce`、`compactMap` 等高階函式

- **同步配置**：`configure` 類型的方法

- **SwiftUI**：`ViewBuilder` 的內容閉包

- **事務性操作**：需要立即執行完成的邏輯

### **檢查建議：**

1. 搜尋專案中的 `@escaping` 關鍵字，檢查是否都有適當的 `\[weak self\]` 或 `\[unowned self\]`

2. 檢查所有網路請求的 completion handler 是否可能造成循環引用

3. 檢查 ViewController 的 `deinit` 是否被正確呼叫（測試記憶體洩漏）

## **8\. 延伸問題**

這個概念可以延伸出以下深入議題：

1. **weak 與 unowned 的選擇時機**：什麼情況下該用 `weak`？何時可以安全使用 `unowned`？

2. **循環引用檢測**：如何使用 Instruments 的 Leaks 和 Allocations 工具追蹤記憶體洩漏？

3. **閉包的 retain cycle 模式**：

   - Self -> Property -> Closure -> Self

   - Delegate pattern 中的閉包替代方案

4. **逃逸閉包的執行緒安全**：在多執行緒環境中使用逃逸閉包需要注意什麼？

5. **編譯器最佳化**：非逃逸閉包讓編譯器做了哪些具體的最佳化？

6. **Swift 演進**：為什麼 Swift 3 要將閉包預設改為非逃逸？這個設計決策的考量是什麼？

7. **withoutActuallyEscaping**：這個特殊函式的用途和使用時機？

8. **async/await 對閉包的影響**：Swift 5.5 的 async/await 如何改變我們處理非同步操作的方式？

## **9\. 未來研究方向**

### **1\. Swift Concurrency（並發機制）**

- 深入學習 `async/await` 語法

- 理解 `Task`、`TaskGroup` 的運作原理

- 掌握 `Actor` 模型如何解決資料競爭

- 研究 `@MainActor` 與 UI 更新的關係

### **2\. 記憶體管理進階主題**

- 深入理解 ARC 的內部實作機制

- 學習使用 Instruments 進行記憶體分析

- 研究 Autorelease Pool 的運作原理

- 探索 Swift 的 Copy-on-Write 最佳化

### **3\. 函數式程式設計**

- 掌握更多高階函式的使用模式

- 理解 Functor、Monad 等函數式概念

- 學習 Combine 框架的響應式程式設計

- 研究 Result type 與錯誤處理模式

### **4\. 設計模式與架構**

- 使用閉包實作 Observer 模式

- 研究 Callback-based 與 Delegate-based 架構的取捨

- 探索 MVVM 中的 data binding 實作

- 學習如何設計清晰的 API interface

### **5\. 效能最佳化**

- 研究閉包捕獲列表對效能的影響

- 學習如何減少不必要的記憶體配置

- 理解 Stack vs Heap 分配的效能差異

- 掌握使用 Instruments 進行效能調校的技巧

---

**總結**：逃逸與非逃逸閉包是 Swift 記憶體管理的核心概念。理解它們的差異不只是為了通過面試，更是為了寫出高效、無記憶體洩漏的 iOS 應用程式。每天花點時間檢查自己的程式碼，確保正確使用 `@escaping` 和捕獲列表，久而久之就能培養出優秀的記憶體管理直覺！💪