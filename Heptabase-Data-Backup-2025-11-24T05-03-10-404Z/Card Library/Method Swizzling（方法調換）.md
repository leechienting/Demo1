# **Method Swizzling\
（方法調換）**

## 1\. 概念名稱：**Method Swizzling（方法調換）**

## 2\. 這是什麼？

想像你有一台自動販賣機，按下「可樂」按鈕原本會掉可樂，但你偷偷把機器內部的線路對調了，現在按「可樂」按鈕會掉出「雪碧」。Method Swizzling 就是這個概念——它讓你在程式執行時期（runtime）動態地「交換」兩個方法的實作內容。

在 Objective-C 的 runtime 系統中，每個方法呼叫其實都是透過「訊息傳遞」機制。Method Swizzling 利用這個特性，讓你可以在不修改原始程式碼的情況下，把 A 方法的實作換成 B 方法的實作，反之亦然。這是一種強大但危險的技術。

## 3\. 為什麼重要？

**解決的問題：**

- **無侵入式修改系統或第三方框架行為**：當你需要修改 UIKit 或其他框架的行為，但無法直接修改原始碼時

- **全域性的方法攔截與監控**：想要追蹤所有 ViewController 的生命週期，而不用在每個類別中重複寫程式碼

- **修復系統 Bug 或添加功能**：在不繼承的情況下為既有類別增加功能

- **AOP（面向切面程式設計）**：實現日誌記錄、效能監控、埋點統計等橫切關注點

**若不用Method Swizzling，要如何達成？**

- 必須透過繼承來覆寫方法，但無法影響已經實例化的物件

- 無法修改第三方框架或系統類別的行為

- 需要在每個需要修改的地方重複寫程式碼

- 某些全域性的功能（如全應用程式的埋點）會變得非常繁瑣

## 4\. 關鍵機制有哪些？

**核心概念：**

1. **SEL (Selector)**：方法選擇器，就像是方法的「名字」或「ID」

2. **IMP (Implementation)**：方法實作的函式指標，指向真正執行的程式碼

3. **Method**：將 SEL 和 IMP 綁定在一起的結構

4. **Method Table**：每個類別都有一個方法表，儲存 SEL 到 IMP 的對應關係

5. **Runtime API**：`method_exchangeImplementations`、`class_getInstanceMethod` 等函式

6. **dispatch_once**：確保 Swizzling 只執行一次，避免重複交換導致恢復原狀

**關鍵專有名詞：**

- **Swizzling**：交換方法實作的動作

- **Original Implementation**：原始方法的實作

- **Swizzled Implementation**：交換後的新實作

- **Category（分類/擴充）**：通常在 Category 的 `+load` 方法中執行 Swizzling

## 5\. 如何運作？

**核心運作流程：**

當你呼叫 `[object someMethod]` 時，Objective-C Runtime 會：

1. 查找 `object` 所屬類別的 Method Table

2. 根據 SEL（`someMethod`）找到對應的 IMP（函式指標）

3. 執行 IMP 指向的程式碼

**Swizzling 的運作原理：**

```swift
原始狀態：
SEL(methodA) → IMP(實作A)
SEL(methodB) → IMP(實作B)

執行 Swizzling 後：
SEL(methodA) → IMP(實作B)
SEL(methodB) → IMP(實作A)
```

當你呼叫 `methodA` 時，實際上會執行原本 `methodB` 的程式碼。

**實作步驟：**

1. 在 `+load` 方法中執行（確保類別載入時就進行交換）

2. 使用 `dispatch_once` 確保只交換一次

3. 透過 `class_getInstanceMethod` 取得兩個 Method 物件

4. 呼叫 `method_exchangeImplementations` 交換實作

5. 在新的實作中可以呼叫「自己」（實際會呼叫到原始方法）

## 6\. 實際例子

**場景：追蹤所有 ViewController 的頁面瀏覽事件**

假設你需要在每個畫面出現時發送埋點資料，傳統做法需要在每個 ViewController 的 `viewDidAppear` 中寫程式碼。使用 Method Swizzling 可以一次搞定：

```swift
// Swift 版本（使用 Objective-C Runtime）
extension UIViewController {
    @objc static func swizzleViewDidAppear() {
        guard let originalMethod = class_getInstanceMethod(
            UIViewController.self,
            #selector(viewDidAppear(_:))
        ),
        let swizzledMethod = class_getInstanceMethod(
            UIViewController.self,
            #selector(swizzled_viewDidAppear(_:))
        ) else { return }
        
        method_exchangeImplementations(originalMethod, swizzledMethod)
    }
    
    @objc private func swizzled_viewDidAppear(_ animated: Bool) {
        // 先呼叫原始實作（現在藏在 swizzled_viewDidAppear 中）
        swizzled_viewDidAppear(animated)
        
        // 添加追蹤邏輯
        let pageName = String(describing: type(of: self))
        Analytics.track(event: "PageView", parameters: ["page": pageName])
    }
}

// 在 AppDelegate 中執行
UIViewController.swizzleViewDidAppear()
```

**效果：**

- 所有 ViewController（包括子類別）的 `viewDidAppear` 都會自動記錄埋點

- 不需要修改任何現有程式碼

- 完全透明，開發者甚至不需要知道有這個機制

## 7\. 工作中的連結

**在專案中可能的應用場景：**

1. **全域錯誤處理**：Swizzle `NSURLSession` 的相關方法，統一處理網路請求錯誤

2. **效能監控**：交換 `viewDidLoad`、`viewDidAppear` 追蹤頁面載入時間

3. **防止按鈕重複點擊**：Swizzle `sendAction:to:forEvent:` 加入防連點機制

4. **圖片快取優化**：交換 `UIImageView` 的 `setImage:` 方法，自動加入快取邏輯

5. **深色模式適配**：在舊程式碼中透過 Swizzling 快速適配顏色

**需要注意的地方：**

- 檢查專案中是否已有人使用 Swizzling（避免重複交換）

- 第三方 SDK（如 Firebase、友盟）可能也在使用，要注意衝突

- 在 Swift 中使用需要確保方法有 `@objc` 和 `dynamic` 修飾符

- 如果交換的是私有 API，可能在 App Review 時被拒絕

## 8\. 提出延伸問題

**深入思考的方向：**

1. **與 Swift 的相容性**：為什麼 Method Swizzling 在純 Swift 程式碼中不容易實現？與 Swift 的靜態派發有什麼關係？

2. **效能影響**：Method Swizzling 會對 App 啟動時間和執行效能造成什麼影響？如何量化這個影響?

3. **多執行緒安全**：如果多個執行緒同時觸發被 Swizzle 的方法，會有什麼問題？該如何處理？

4. **替代方案**：在 Swift 時代，有沒有更安全的方式達到類似效果？Protocol Extension、Proxy Pattern 或 Decorator Pattern 能否取代？

5. **除錯困難**：當程式碼出問題時，堆疊追蹤會變得難以理解。有什麼工具或技巧可以協助除錯？

6. **版本相容性**：iOS 系統更新後，系統類別的方法簽名可能改變，如何確保 Swizzling 程式碼的穩定性？

7. **ABI 穩定性**：Swift 5 之後的 ABI 穩定對 Method Swizzling 有什麼影響？是否還能像以前一樣自由使用？

8. **倫理與規範**：在團隊協作中，什麼情況下「應該」使用 Method Swizzling？什麼情況下「不該」使用？如何建立共識？

---

**小結：** Method Swizzling 是 iOS 開發中的「雙面刃」——強大但危險。它讓你能夠在不修改原始碼的情況下改變程式行為，這在實作橫切關注點（如日誌、監控、埋點）時極為有用。然而，濫用會導致程式碼難以維護、除錯困難，甚至引發意想不到的 bug。

理解其底層原理（Objective-C Runtime 的訊息傳遞機制）後,你會更清楚何時該用、何時不該用。在現代 iOS 開發中,隨著 Swift 的普及,我們有更多安全的替代方案。但 Method Swizzling 依然是你工具箱中不可或缺的一項技能——不是為了常用,而是為了在關鍵時刻能夠解決那些「不可能」的問題。