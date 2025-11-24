# Method Swizzling 在 Swift 中的現狀

## 簡短回答

**可以，但有嚴格限制，且不推薦作為主要解決方案。**

---

## 詳細說明

### 1\. **技術上可行的情況**

Method Swizzling 在 Swift 中**仍然可以使用**，但必須滿足以下條件：

```swift
class MyViewController: UIViewController {
    
    // ✅ 可以被 Swizzle（符合所有條件）
    @objc dynamic func trackableMethod() {
        print("Original method")
    }
    
    // ❌ 無法被 Swizzle（缺少 @objc）
    func pureSwiftMethod() {
        print("Pure Swift")
    }
    
    // ❌ 無法被 Swizzle（缺少 dynamic）
    @objc func staticDispatchMethod() {
        print("Static dispatch")
    }
}
```

**必要條件：**

1. 方法必須標記為 `@objc`（暴露給 Objective-C Runtime）

2. 方法必須標記為 `dynamic`（強制使用動態派發）

3. 類別必須繼承自 `NSObject`（或其子類別，如 `UIViewController`）

4. 不能是 `final` 方法或在 `final` 類別中

---

### 2\. **Swift 派發機制的影響**

Swift 有三種方法派發機制，只有一種支援 Swizzling：

| 派發方式 | 說明 | 支援 Swizzling | 
|---|---|---|
| **Direct Dispatch**（直接派發） | 編譯時期決定呼叫位址，最快 | ❌ | 
| **Table Dispatch**（表派發） | 透過 V-Table 查找，Swift 預設 | ❌ | 
| **Message Dispatch**（訊息派發） | Objective-C Runtime，最慢 | ✅ | 

```swift
class Example {
    func method1() { }              // Table Dispatch
    @objc func method2() { }        // Table Dispatch (仍是 Swift 派發)
    @objc dynamic func method3() { } // Message Dispatch (可 Swizzle)
}
```

**關鍵點：** 即使加了 `@objc`，Swift 編譯器預設仍會使用 Table Dispatch 優化效能。只有加上 `dynamic` 才會強制使用 Objective-C Runtime 的訊息派發。

---

### 3\. **實際可行的使用場景**

#### ✅ **場景 A：Swizzle UIKit/Foundation 類別**

這是最常見且相對安全的用法：

```swift
extension UIViewController {
    static let swizzleViewDidAppear: Void = {
        let originalSelector = #selector(viewDidAppear(_:))
        let swizzledSelector = #selector(swizzled_viewDidAppear(_:))
        
        guard let originalMethod = class_getInstanceMethod(
            UIViewController.self, originalSelector
        ),
        let swizzledMethod = class_getInstanceMethod(
            UIViewController.self, swizzledSelector
        ) else { return }
        
        method_exchangeImplementations(originalMethod, swizzledMethod)
    }()
    
    @objc private func swizzled_viewDidAppear(_ animated: Bool) {
        swizzled_viewDidAppear(animated) // 實際呼叫原始方法
        print("✅ Swizzled: \(String(describing: type(of: self)))")
    }
}

// AppDelegate 中觸發
_ = UIViewController.swizzleViewDidAppear
```

**為什麼可行？**

- UIKit 是 Objective-C 框架，所有方法天生支援訊息派發

- `viewDidAppear(_:)` 本身就是 `@objc dynamic`

---

#### ❌ **場景 B：Swizzle 純 Swift 類別**

這通常**不可行**或**不推薦**：

```swift
class PureSwiftClass {
    func someMethod() {
        print("Original")
    }
}

// ❌ 無法 Swizzle，因為是 Table Dispatch
```

即使強行標記：

```swift
class PureSwiftClass: NSObject {
    @objc dynamic func someMethod() {
        print("Original")
    }
}

// ✅ 技術上可行，但破壞了 Swift 的設計哲學
```

### 4\. **Swift 時代的替代方案**

Apple 和社群推薦的現代做法：

#### **方案 1：Protocol + Extension（協定導向）**

```swift
protocol PageTrackable {
    func trackPageView()
}

extension PageTrackable where Self: UIViewController {
    func trackPageView() {
        let pageName = String(describing: type(of: self))
        Analytics.track(event: "PageView", page: pageName)
    }
}

class MyViewController: UIViewController, PageTrackable {
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackPageView() // 明確呼叫
    }
}
```

**優點：**

- 類型安全

- 編譯時期檢查

- 易於測試與除錯

---

#### **方案 2：Decorator Pattern（裝飾器模式）**

```swift
class ViewControllerDecorator: UIViewController {
    private let wrappedVC: UIViewController
    
    init(wrapping vc: UIViewController) {
        self.wrappedVC = vc
        super.init(nibName: nil, bundle: nil)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        Analytics.track(event: "PageView")
        wrappedVC.viewDidAppear(animated)
    }
}
```

#### **方案 3：使用 Swift 新特性**

- **Property Wrappers** (iOS 13+)：封裝通用邏輯

- **Result Builders** (iOS 13+)：建構 DSL

- **Actors** (iOS 15+)：安全地管理共享狀態

---

### 5\. **目前業界實務**

| 場景 | 是否使用 Swizzling | 替代方案 | 
|---|---|---|
| 全應用程式埋點 | ✅ 仍在使用（如神策、友盟） | Protocol Extension | 
| 修復系統 Bug | ✅ 特殊情況下使用 | 等待系統修復 | 
| 新功能開發 | ❌ 不推薦 | Protocol、Composition | 
| 第三方 SDK 內部 | ✅ 常見（如 Firebase） | \- | 

**現況觀察：**

- **大型第三方 SDK**（Firebase、Sentry）仍大量使用 Swizzling

- **新專案**越來越少直接使用

- **混編專案**（OC + Swift）中較常見

---

### 6\. **實際建議**

#### **什麼時候可以用？**

1. ✅ 你需要修改 UIKit/Foundation 類別的行為

2. ✅ 這是「唯一」可行的解決方案

3. ✅ 你充分理解風險並做好文件記錄

4. ✅ 團隊其他人都知情且同意

#### **什麼時候不該用？**

1. ❌ 只是為了「方便」而不寫額外程式碼

2. ❌ 可以用 Protocol Extension 解決

3. ❌ 專案是純 Swift 且不需要相容舊程式碼

4. ❌ 你無法承擔系統更新後可能的崩潰風險

---

### 7\. **未來展望**

#### **趨勢：**

- Swift 6 強化記憶體安全與並發模型，進一步遠離 Runtime 動態性

- SwiftUI 完全摒棄 Objective-C Runtime

- Apple 推動 Swift-only 框架（如 SwiftData）

#### **結論：**

Method Swizzling 在 Swift 中**技術上可行，但正在被淘汰**。它就像是「古代武器」——在特定場景下仍有用武之地，但新時代有更安全、更優雅的工具。

**我的建議：**

- 學習它，理解原理（面試常考）

- 維護舊專案時知道如何處理

- 但在新專案中，優先考慮 Swift-native 的解決方案

如果你的專案中已經在使用 Swizzling，建議逐步遷移到更現代的架構；如果是新專案，除非有不得已的理由，否則應該避免使用。