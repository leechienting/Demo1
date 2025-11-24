# **深入解析 UIKit 佈局循環**

## 一、這是什麼？

**UIKit 佈局循環**是 iOS 應用程式中視圖系統更新視覺外觀的核心機制。它包含三個主要循環：

1. **佈局循環（Layout Cycle）** - 負責計算和更新視圖的位置與尺寸

2. **約束更新循環（Constraint Update Cycle）** - 負責更新 Auto Layout 約束

3. **繪製循環（Display Cycle）** - 負責重新繪製視圖內容

這些循環通過一系列方法協調工作：

- `setNeedsUpdateConstraints` / `updateConstraints` - 約束更新

- `setNeedsLayout` / `layoutIfNeeded` / `layoutSubviews` - 佈局更新

- `setNeedsDisplay` / `draw(_:)` - 視圖繪製

## 二、為什麼重要？

### 解決的核心問題

**效能優化問題**：如果每次屬性改變都立即重新佈局，會造成嚴重的效能問題。

佈局循環通過「**++標記-更新++**」機制，將多次更改批次處理。

**不使用會怎樣？**

```swift
// ❌ 錯誤做法：手動計算並設置 frame
func updateViews() {
    label.frame = CGRect(x: 10, y: 10, width: 200, height: 30)
    button.frame = CGRect(x: 10, y: 50, width: 200, height: 44)
    // 當螢幕旋轉、尺寸改變時全部失效
}

// ✅ 正確做法：使用佈局系統
func updateViews() {
    setNeedsLayout() // 標記需要更新
    // 系統會在適當時機自動調用 layoutSubviews
}
```

**沒有佈局循環會導致**：

- 🔴 效能問題：每次改變都立即計算佈局

- 🔴 程式碼混亂：到處都是手動 frame 計算

- 🔴 維護困難：螢幕旋轉、尺寸變化需要手動處理

- 🔴 動畫問題：無法優雅地實現佈局動畫

## 三、關鍵機制與核心概念

### 關鍵定義

**1\. Run Loop 整合**

- 佈局更新不是立即發生的

- 系統在 Run Loop 的特定階段批次處理更新

- 這允許多次標記操作只觸發一次實際更新

**2\. ++標記-更新模式（Mark-Update Pattern）++**

```
setNeedsXXX → 標記「需要更新」→ Run Loop 結束前 → 批次更新
```

**3\. ++更新順序++**

```
約束更新 → 佈局更新 → 顯示更新
   ↓           ↓           ↓
updateConstraints → layoutSubviews → draw(_:)
```

### 核心方法對照表

| 方法 | 觸發時機 | 執行時機 | 用途 | 
|---|---|---|---|
| `setNeeds``UpdateConstraints` | 立即返回 | **++下個更新週期++** | 標記約束需要更新 | 
| `updateConstraints``IfNeeded` | 立即執行 | **++立即++** | 強制立即更新約束 | 
| `updateConstraints` | 系統調用 | 自動 | 實際更新約束的地方（override） | 
| `setNeeds``Layout` | 立即返回 | **++下個更新週期++** | 標記佈局需要更新 | 
| `layout``IfNeeded` | 立即執行 | **++立即++** | 強制立即佈局 | 
| `layoutSubviews` | 系統調用 | 自動 | 實際佈局的地方（override） | 
| `setNeeds``Display` | 立即返回 | **++下個更新週期++** | 標記視圖需要重繪 | 
| `draw(_:)` | 系統調用 | 自動 | 實際繪製的地方（override） | 

## 四、如何運作？

### 完整流程圖

```
┌─────────────────────────────────────────────────────────┐
│                    Run Loop Cycle                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1️⃣ 約束更新階段                                          │
│  ┌──────────────────────────────────────┐               │
│  │ setNeedsUpdateConstraints 被調用      │               │
│  │         ↓                             │               │
│  │ 標記：needsUpdateConstraints = true   │               │
│  │         ↓                             │               │
│  │ Run Loop 檢測到標記                    │               │
│  │         ↓                             │               │
│  │ updateConstraintsIfNeeded             │               │
│  │         ↓                             │               │
│  │ updateConstraints (override)          │               │
│  └──────────────────────────────────────┘               │
│                   ↓                                       │
│  2️⃣ 佈局更新階段                                          │
│  ┌──────────────────────────────────────┐               │
│  │ setNeedsLayout 被調用                 │               │
│  │         ↓                             │               │
│  │ 標記：needsLayout = true              │               │
│  │         ↓                             │               │
│  │ Run Loop 檢測到標記                    │               │
│  │         ↓                             │               │
│  │ layoutSubviews 被自動調用              │               │
│  │   - 計算所有子視圖的 frame             │               │
│  │   - 應用 Auto Layout 結果              │               │
│  └──────────────────────────────────────┘               │
│                   ↓                                       │
│  3️⃣ 繪製更新階段                                          │
│  ┌──────────────────────────────────────┐               │
│  │ setNeedsDisplay 被調用                │               │
│  │         ↓                             │               │
│  │ 標記：needsDisplay = true             │               │
│  │         ↓                             │               │
│  │ Run Loop 檢測到標記                    │               │
│  │         ↓                             │               │
│  │ draw(_:) 被自動調用                    │               │
│  │   - 繪製視圖內容到圖層                 │               │
│  └──────────────────────────────────────┘               │
│                                                           │
└─────────────────────────────────────────────────────────┘

特殊情況：layoutIfNeeded
┌──────────────────────────────────────┐
│ layoutIfNeeded 被調用                 │
│         ↓                             │
│ 檢查 needsLayout 標記                 │
│         ↓                             │
│ 如果為 true：立即執行 layoutSubviews  │
│ 如果為 false：什麼都不做              │
└──────────────────────────────────────┘
```

### 核心機制詳解

**機制 1：延遲批次更新**

```swift
// 這些調用會被批次處理
view.setNeedsLayout()  // 標記
view.setNeedsLayout()  // 標記（重複標記不會造成多次更新）
view.setNeedsLayout()  // 標記
// Run Loop 結束前只會執行一次 layoutSubviews
```

**機制 2：向上傳播**

```swift
// 子視圖的 setNeedsLayout 會向上傳播
subview.setNeedsLayout()
// ↓ 會標記
superview.needsLayout = true
// ↓ 繼續向上
rootView.needsLayout = true
```

**機制 3：Auto Layout 與佈局循環**

```
約束改變 → invalidateIntrinsicContentSize
         ↓
    setNeedsUpdateConstraints
         ↓
    updateConstraints
         ↓
    系統計算約束
         ↓
    setNeedsLayout
         ↓
    layoutSubviews (應用計算結果)
```

## 五、實際例子

### 場景：動態改變標籤(Label)文字並動畫佈局

```swift
class DynamicLabelView: UIView {
    private let titleLabel = UILabel()
    private let contentLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    private func setupViews() {
        // 設置約束
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentLabel.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(titleLabel)
        addSubview(contentLabel)
        
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: topAnchor, constant: 16),
            titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
            
            contentLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            contentLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            contentLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
            contentLabel.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -16)
        ])
    }
    
    // ✅ 正確做法：使用佈局循環
    func updateContent(title: String, content: String, animated: Bool = true) {
        titleLabel.text = title
        contentLabel.text = content
        
        // 1. 標記約束需要更新（如果文字變化影響 intrinsic size）
        titleLabel.setNeedsUpdateConstraints()
        contentLabel.setNeedsUpdateConstraints()
        
        // 2. 標記需要重新佈局
        setNeedsLayout()
        
        if animated {
            // 3. 在動畫 block 中強制立即佈局
            UIView.animate(withDuration: 0.3) {
                self.layoutIfNeeded() // 立即觸發 layoutSubviews
            }
        }
    }
    
    // Override layoutSubviews 來觀察佈局時機
    override func layoutSubviews() {
        super.layoutSubviews()
        print("📐 layoutSubviews 被調用，frame: \(frame)")
        // 這裡可以做額外的佈局調整
    }
    
    // Override updateConstraints 來觀察約束更新
    override func updateConstraints() {
        super.updateConstraints()
        print("🔗 updateConstraints 被調用")
        // 這裡可以動態調整約束
    }
}

// 使用示例
let dynamicView = DynamicLabelView(frame: .zero)
dynamicView.updateContent(
    title: "新標題", 
    content: "這是更長的內容文字，會觸發佈局重新計算",
    animated: true
)
```

### 場景：自定義可展開(Expandable)的視圖

```swift
class ExpandableCardView: UIView {
    private var isExpanded = false
    private var heightConstraint: NSLayoutConstraint?
    private let contentView = UIView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    private func setupViews() {
        contentView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(contentView)
        
        heightConstraint = contentView.heightAnchor.constraint(equalToConstant: 100)
        
        NSLayoutConstraint.activate([
            contentView.topAnchor.constraint(equalTo: topAnchor),
            contentView.leadingAnchor.constraint(equalTo: leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: bottomAnchor),
            heightConstraint!
        ])
    }
    
    func toggleExpand(animated: Bool = true) {
        isExpanded.toggle()
        
        // 1. 更新約束值
        heightConstraint?.constant = isExpanded ? 300 : 100
        
        // 2. 標記『約束』需要更新
        setNeedsUpdateConstraints()
        
        // 3. 標記『佈局』需要更新
        setNeedsLayout()
        
        if animated {
            // 4. 動畫展開/收合
            UIView.animate(
                withDuration: 0.3,
                delay: 0,
                usingSpringWithDamping: 0.8,
                initialSpringVelocity: 0,
                options: .curveEaseInOut
            ) {
                // 5. 強制立即佈局，產生動畫效果
                self.layoutIfNeeded()
                
                // 6. 同時觸發父視圖佈局（如果在 UIScrollView 中）
                self.superview?.layoutIfNeeded()
            }
        } else {
            // 非動畫：依然使用佈局循環，只是不在動畫 block 中
            // 下個 run loop 會自動更新
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        print("📐 Card layoutSubviews: height = \(bounds.height)")
        
        // 可以在這裡根據 bounds 調整子視圖
        contentView.layer.cornerRadius = isExpanded ? 16 : 8
    }
}
```

### 場景：自定義繪製(draw)視圖

```swift
class CircularProgressView: UIView {
    var progress: CGFloat = 0 {
        didSet {
            // 當進度改變時，標記需要重繪
            setNeedsDisplay() // 這會觸發 draw(_:)
        }
    }
    
    var progressColor: UIColor = .blue {
        didSet {
            setNeedsDisplay()
        }
    }
    
    // Override draw 來實際繪製
    override func draw(_ rect: CGRect) {
        super.draw(rect)
        
        guard let context = UIGraphicsGetCurrentContext() else { return }
        
        let center = CGPoint(x: bounds.midX, y: bounds.midY)
        let radius = min(bounds.width, bounds.height) / 2 - 10
        
        // 繪製背景圓
        context.setStrokeColor(UIColor.lightGray.cgColor)
        context.setLineWidth(8)
        context.addArc(
            center: center,
            radius: radius,
            startAngle: 0,
            endAngle: .pi * 2,
            clockwise: false
        )
        context.strokePath()
        
        // 繪製進度弧
        context.setStrokeColor(progressColor.cgColor)
        context.setLineWidth(8)
        context.setLineCap(.round)
        
        let startAngle = -CGFloat.pi / 2
        let endAngle = startAngle + (2 * .pi * progress)
        
        context.addArc(
            center: center,
            radius: radius,
            startAngle: startAngle,
            endAngle: endAngle,
            clockwise: false
        )
        context.strokePath()
        
        print("🎨 draw(_:) 被調用，progress: \(progress)")
    }
    
    // 當 bounds 改變時，系統會自動調用 setNeedsDisplay
    override func layoutSubviews() {
        super.layoutSubviews()
        // bounds 改變了，需要重繪
        setNeedsDisplay()
    }
}

// 使用示例
let progressView = CircularProgressView(frame: CGRect(x: 0, y: 0, width: 200, height: 200))
progressView.progress = 0.75 // 這會觸發 setNeedsDisplay → draw(_:)
```

## 六、工作中的連結

### 在專案中可能遇到的場景

**1\. UITableView / UICollectionView 效能優化**

```swift
// ❌ 常見錯誤：在 cellForRow 中過度調用
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
    cell.layoutIfNeeded() // ❌ 不必要！系統會自動處理
    return cell
}

// ✅ 正確做法
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
    // 只需要配置數據，佈局交給系統
    cell.configure(with: data[indexPath.row])
    return cell
}
```

**2\. 動畫實現中的應用(TableViewCell)**

```swift
// 項目中常見：展開/收合動畫
class CommentCell: UITableViewCell {
    var isExpanded = false
    
    func setExpanded(_ expanded: Bool, animated: Bool) {
        isExpanded = expanded
        
        // 更新約束
        detailLabel.isHidden = !expanded
        setNeedsUpdateConstraints()
        
        if animated {
            UIView.animate(withDuration: 0.3) {
                self.layoutIfNeeded() // 關鍵：在動畫 block 中
            } completion: { _ in
                // 通知 tableView 更新高度
                self.delegate?.cellDidChangeHeight(self)
            }
        }
    }
}
```

**3\. 響應式佈局 / 螢幕旋轉**

```swift
class AdaptiveViewController: UIViewController {
    override func viewWillTransition(
        to size: CGSize,
        with coordinator: UIViewControllerTransitionCoordinator
    ) {
        super.viewWillTransition(to: size, with: coordinator)
        
        coordinator.animate { context in
            // 在轉場動畫中更新佈局
            self.view.setNeedsLayout()
            self.view.layoutIfNeeded()
        }
    }
}
```

**4\. 自定義控件開發(UIButton)**

```swift
// 項目中可能需要自定義的 UI 控件
class CustomButton: UIButton {
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // 根據最終 bounds 調整樣式
        layer.cornerRadius = bounds.height / 2
        
        // 調整 imageView 和 titleLabel 位置
        if let imageView = imageView, let titleLabel = titleLabel {
            let spacing: CGFloat = 8
            let totalWidth = imageView.frame.width + spacing + titleLabel.frame.width
            let startX = (bounds.width - totalWidth) / 2
            
            imageView.frame.origin.x = startX
            titleLabel.frame.origin.x = startX + imageView.frame.width + spacing
        }
    }
}
```

**5\. 性能監控**

```swift
// 在 debug 模式下監控佈局循環
#if DEBUG
class LayoutDebugView: UIView {
    override func layoutSubviews() {
        super.layoutSubviews()
        let start = CFAbsoluteTimeGetCurrent()
        
        // 你的佈局代碼
        
        let duration = CFAbsoluteTimeGetCurrent() - start
        if duration > 0.016 { // 超過一幀（60fps）
            print("⚠️ layoutSubviews 太慢：\(duration * 1000)ms")
        }
    }
}
#endif
```

## 七、延伸問題與深入思考

### 問題 1：為什麼需要區分 `setNeedsLayout` 和 `layoutIfNeeded`？為了效能考量

**答案**：這體現了性能優化的權衡

```swift
// 情境 A：批次更新多個視圖（推薦）
view1.setNeedsLayout()
view2.setNeedsLayout()
view3.setNeedsLayout()
// Run Loop 結束時一次性處理，效能最佳

// 情境 B：需要立即獲取佈局結果
let originalFrame = view.frame
view.setNeedsLayout()
view.layoutIfNeeded() // 立即佈局
let newFrame = view.frame // 獲取更新後的 frame
```

### 問題 2：Auto Layout 與手動佈局如何協作？自動與手動協作

**混合使用的規則**：

```swift
class HybridLayoutView: UIView {
    let autoLayoutView = UIView() // 使用 Auto Layout
    let manualView = UIView()      // 手動佈局
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        // Auto Layout 視圖
        autoLayoutView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(autoLayoutView)
        NSLayoutConstraint.activate([
            autoLayoutView.topAnchor.constraint(equalTo: topAnchor),
            autoLayoutView.leadingAnchor.constraint(equalTo: leadingAnchor),
            autoLayoutView.widthAnchor.constraint(equalToConstant: 100),
            autoLayoutView.heightAnchor.constraint(equalToConstant: 100)
        ])
        
        // 手動佈局視圖
        manualView.translatesAutoresizingMaskIntoConstraints = true // ⚠️ 關鍵
        addSubview(manualView)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // super.layoutSubviews() 已經處理了 Auto Layout
        // 這裡處理手動佈局
        manualView.frame = CGRect(
            x: autoLayoutView.frame.maxX + 10,
            y: 0,
            width: bounds.width - autoLayoutView.frame.maxX - 20,
            height: 100
        )
    }
}
```

### 問題 3：`setNeedsDisplay` vs `setNeedsLayout` 的區別？

| 特性 | setNeedsDisplay**（渲染）** | setNeedsLayout**（計算）** | 
|---|---|---|
| **目的** | 重繪視圖內容（像素） | 重新計算位置與尺寸 | 
| **觸發方法** | `draw(_:)` | `layoutSubviews()` | 
| **使用場景** | 自定義繪製、顏色變化 | frame/bounds/約束變化 | 
| **性能影響** | 需要重繪圖層 | 只是計算幾何 | 
| **是否影響子視圖** | 否 | 是（遞迴） | 

```swift
// 示例：只需要重繪 vs 需要重新佈局
class CustomView: UIView {
    var fillColor: UIColor = .blue {
        didSet {
            setNeedsDisplay() // ✅ 只是顏色變了，用 setNeedsDisplay
        }
    }
    
    var cornerRadius: CGFloat = 8 {
        didSet {
            setNeedsDisplay() // ✅ 只是圓角變了，用 setNeedsDisplay
        }
    }
    
    var customFrame: CGRect = .zero {
        didSet {
            setNeedsLayout() // ✅ 位置變了，用 setNeedsLayout
        }
    }
}
```

### 問題 4：過度調用 `layoutIfNeeded` 的性能陷阱

```swift
// ❌ 性能災難
func updateViews() {
    for i in 0..<100 {
        subviews[i].setNeedsLayout()
        subviews[i].layoutIfNeeded() // 每次都強制佈局！
    }
}

// ✅ 正確做法
func updateViews() {
    for i in 0..<100 {
        subviews[i].setNeedsLayout() // 只標記
    }
    // Run Loop 會自動批次處理
}

// ⚠️ 有時候確實需要立即佈局
func animateWithLayout() {
    view.setNeedsLayout()
    
    UIView.animate(withDuration: 0.3) {
        self.view.layoutIfNeeded() // ✅ 動畫需要立即佈局
    }
}
```

### 問題 5：佈局循環與視圖層次結構

**向上傳播的影響**：

```swift
/*
  RootView
    ├─ ContainerView
    │   ├─ ChildView1
    │   └─ ChildView2
    └─ SiblingView
*/

// 當 ChildView1 調用 setNeedsLayout
childView1.setNeedsLayout()

// 實際發生：
// 1. childView1.needsLayout = true
// 2. containerView.needsLayout = true （向上傳播）
// 3. rootView.needsLayout = true （繼續向上）

// Run Loop 更新時：
// rootView.layoutSubviews() 被調用
//   → containerView.layoutSubviews() 被調用
//     → childView1.layoutSubviews() 被調用 ✅
//     → childView2.layoutSubviews() 可能被調用（如果 container 佈局改變了它）
```

### 問題 6：如何Debug 佈局問題？

```swift
// 技巧 1：Override 並打印調用堆棧
override func layoutSubviews() {
    super.layoutSubviews()
    print("📐 \(type(of: self)) layoutSubviews")
    print("   Frame: \(frame)")
    print("   Bounds: \(bounds)")
    // 可選：打印調用堆棧
    // print(Thread.callStackSymbols)
}

// 技巧 2：使用 Xcode View Debugger
// 選單: Debug → View Debugging → Capture View Hierarchy

// 技巧 3：檢測約束衝突
UserDefaults.standard.set(true, forKey: "_UIConstraintBasedLayoutLogUnsatisfiable")

// 技巧 4：監控佈局循環次數
class LayoutMonitor {
    static var layoutCount = 0
    
    static func trackLayout() {
        layoutCount += 1
        if layoutCount > 100 {
            assertionFailure("⚠️ 佈局循環次數過多！可能有遞迴佈局問題")
        }
    }
}
```

### 問題 7：iOS 13+ 的新特性影響

```swift
// iOS 13+ 引入的變化
class ModernLayoutView: UIView {
    // UIView 新增的 directionalLayoutMargins
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // 支援 RTL（從右到左）語言
        let margins = directionalLayoutMargins
        let leadingMargin = margins.leading  // 而不是 left
        let trailingMargin = margins.trailing // 而不是 right
    }
}

// SwiftUI 與 UIKit 互操作
struct ContentView: View {
    var body: some View {
        LegacyViewWrapper()
    }
}

struct LegacyViewWrapper: UIViewRepresentable {
    func makeUIView(context: Context) -> CustomUIView {
        return CustomUIView()
    }
    
    func updateUIView(_ uiView: CustomUIView, context: Context) {
        // 當 SwiftUI 狀態變化時，需要觸發 UIKit 佈局
        uiView.setNeedsLayout()
    }
}
```

---

## 總結：最佳實踐

### ✅ DO（應該做）

1. **使用 `setNeedsLayout` 進行批次更新**

2. **只在動畫或需要立即獲取佈局結果時用 `layoutIfNeeded`**

3. **Override `layoutSubviews` 來實現自定義佈局邏輯**

4. **使用 `setNeedsDisplay` 觸發自定義繪製**

5. **讓系統自動調用佈局方法，不要手動調用**

### ❌ DON'T（不應該做）

1. **不要手動調用 `layoutSubviews()` 或 `draw(_:)`**

2. **不要在 `layoutSubviews` 中調用 `setNeedsLayout`（會造成無限循環）**

3. **不要過度使用 `layoutIfNeeded`（性能問題）**

4. **不要在 `draw(_:)` 中修改視圖層次結構**

5. **不要假設佈局會立即發生（除非使用 `layoutIfNeeded`）**

希望這篇文章能幫助你深入理解 UIKit 的佈局循環機制！🚀




