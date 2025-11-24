# Q @MainActor使用時機為何?

# @MainActor 使用時機詳解

讓我用白話方式說明 `@MainActor` 的使用時機和原理。

---

## 1\. @MainActor 是什麼？

### 白話解釋

`@MainAactor` 就是告訴編譯器：「這段程式碼必須在主執行緒上執行」

在 iOS 開發中有個鐵則：**所有 UI 更新都必須在主執行緒進行**

---

## 2\. 為什麼需要 @MainActor？

### 問題場景

在使用 async/await 之前，我們這樣寫：

```swift
// 舊的方式
func loadData() {
    // 在背景執行緒下載
    DispatchQueue.global().async {
        let data = downloadData()
        
        // 手動切回主執行緒更新 UI
        DispatchQueue.main.async {
            self.label.text = data
        }
    }
}
```

使用 async/await 後：

```swift
// 問題：這樣寫可能不在主執行緒！
func loadData() async {
    let data = await downloadData()
    label.text = data  // ⚠️ 危險！可能不在主執行緒
}
```

### async/await 的特性

當你使用 `await` 時，程式會暫停，等恢復執行時**可能在任何執行緒**，不一定是主執行緒！

---

## 3\. @MainActor 的使用時機

### 時機 1：標記整個 Class（最常見）

**適用於：ViewController、ViewModel、SwiftUI View**

```swift
// ✅ 整個 ViewController 都在主執行緒
@MainActor
class ProfileViewController: UIViewController {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var avatarImageView: UIImageView!
    
    func loadProfile() async {
        let user = await UserService.fetchUser()
        
        // 不需要手動切換執行緒，已經在主執行緒了
        nameLabel.text = user.name
        avatarImageView.image = user.avatar
    }
    
    @IBAction func refreshButtonTapped() {
        Task {
            await loadProfile()  // 保證在主執行緒執行
        }
    }
}
```

**為什麼這樣做？**

- ViewController 的所有方法都會操作 UI

- 標記整個 class 比每個方法都標記方便

- 避免忘記切換執行緒

---

### 時機 2：標記單一方法

**適用於：Service 類別中少數需要更新 UI 的方法**

```swift
class DataService {
    
    // 一般方法：不需要在主執行緒
    func fetchData() async -> Data {
        // 網路請求，可以在任何執行緒
        let (data, _) = try! await URLSession.shared.data(from: url)
        return data
    }
    
    // 特定方法：需要更新 UI
    @MainActor
    func loadAndDisplay(in imageView: UIImageView) async {
        let data = await fetchData()
        let image = UIImage(data: data)
        
        // 因為有 @MainActor，這裡保證在主執行緒
        imageView.image = image
    }
}
```

---

### 時機 3：標記屬性（Property）

**適用於：需要從主執行緒存取的屬性**

```swift
class ImageCache {
    
    // 這個屬性只能在主執行緒存取
    @MainActor
    var cachedImages: [String: UIImage] = [:]
    
    // 一般方法：背景執行緒
    func downloadImage(url: String) async -> UIImage {
        // 下載圖片...
        return image
    }
    
    // 需要存取 @MainActor 屬性，所以方法也要 @MainActor
    @MainActor
    func getCachedImage(for key: String) -> UIImage? {
        return cachedImages[key]
    }
}
```

---

## 4\. 實際使用案例對比

### 案例 1：UIViewController

```swift
// ❌ 沒有 @MainActor - 可能出錯
class BadViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    
    func loadData() async {
        let text = await fetchText()
        
        // ⚠️ 警告：這可能不在主執行緒！
        label.text = text  // 可能崩潰或 UI 不更新
    }
}

// ✅ 有 @MainActor - 安全
@MainActor
class GoodViewController: UIViewController {
    @IBOutlet weak var label: UILabel!
    
    func loadData() async {
        let text = await fetchText()
        
        // ✅ 保證在主執行緒
        label.text = text
    }
}
```

---

### 案例 2：SwiftUI View

```swift
// SwiftUI 的 View 自動是 @MainActor
// 但 ViewModel 需要手動標記

// ✅ 正確做法
@MainActor
class ProfileViewModel: ObservableObject {
    @Published var userName: String = ""
    @Published var isLoading: Bool = false
    
    func loadProfile() async {
        isLoading = true
        
        let user = await UserService.fetchUser()
        
        // 因為有 @MainActor，這裡保證在主執行緒
        userName = user.name
        isLoading = false
    }
}

struct ProfileView: View {
    @StateObject var viewModel = ProfileViewModel()
    
    var body: some View {
        Text(viewModel.userName)
            .task {
                await viewModel.loadProfile()
            }
    }
}
```

---

### 案例 3：混合使用（部分在主執行緒，部分在背景）

```swift
class ImageProcessor {
    
    // 背景執行緒處理（耗時操作）
    func processImage(_ image: UIImage) async -> UIImage {
        // 複雜的圖片處理...
        return processedImage
    }
    
    // 主執行緒更新（更新 UI）
    @MainActor
    func processAndDisplay(
        _ image: UIImage,
        in imageView: UIImageView
    ) async {
        // 步驟 1：切到背景處理（自動切換）
        let processed = await processImage(image)
        
        // 步驟 2：自動回到主執行緒更新 UI
        imageView.image = processed
    }
}
```

---

## 5\. 從非 @MainActor 呼叫 @MainActor 方法

### 情境說明

有時候你在背景執行緒的程式碼中，需要呼叫主執行緒的方法：

```swift
class NetworkManager {
    
    // 這個方法在背景執行緒
    func downloadAndProcess() async {
        let data = await downloadData()
        
        // 需要在主執行緒更新 UI
        // 必須用 await 呼叫（因為要切換執行緒）
        await updateUI(with: data)
    }
    
    // 這個方法必須在主執行緒
    @MainActor
    func updateUI(with data: Data) {
        // 更新 UI...
    }
}
```

**重點：呼叫 @MainActor 方法時，必須加 `await`**

因為可能需要切換執行緒，是一個非同步操作。

---

## 6\. 常見錯誤與解決

### 錯誤 1：忘記標記 ViewController

```swift
// ❌ 錯誤
class MyViewController: UIViewController {
    func update() async {
        await loadData()
        label.text = "完成"  // 編譯器警告！
    }
}

// ✅ 修正
@MainActor
class MyViewController: UIViewController {
    func update() async {
        await loadData()
        label.text = "完成"  // OK
    }
}
```

---

### 錯誤 2：在 @MainActor 中做耗時操作

```swift
// ❌ 不好的做法
@MainActor
class BadViewModel: ObservableObject {
    func loadData() async {
        // 這會阻塞主執行緒！
        let data = heavyComputation()  // 同步耗時操作
        updateUI(data)
    }
    
    func heavyComputation() -> Data {
        // 很慢的計算...
        return data
    }
}

// ✅ 好的做法
@MainActor
class GoodViewModel: ObservableObject {
    func loadData() async {
        // 明確切到背景執行
        let data = await Task.detached {
            return self.heavyComputation()
        }.value
        
        // 自動回到主執行緒更新 UI
        updateUI(data)
    }
    
    // 不在 @MainActor 中
    nonisolated func heavyComputation() -> Data {
        // 很慢的計算...
        return data
    }
}
```

---

## 7\. 使用時機總結表

| 情境 | 是否使用 @MainActor | 原因 | 
|---|---|---|
| UIViewController | ✅ 是 | 所有方法都操作 UI | 
| SwiftUI ViewModel | ✅ 是 | 更新 @Published 屬性 | 
| SwiftUI View | 不用（自動） | View 本身已經是 @MainActor | 
| Network Service | ❌ 否 | 不需要操作 UI | 
| Database Service | ❌ 否 | 背景執行更好 | 
| Image Processor | ❌ 否 | 耗時操作應在背景 | 
| 某方法需更新 UI | ✅ 單一方法標記 | 只有該方法需要主執行緒 | 

---

## 8\. 記憶口訣

**「碰 UI 就要 @MainActor」**

- ✅ 操作 UILabel、UIImageView 等 → 需要

- ✅ 更新 @Published 屬性 → 需要

- ✅ 呼叫 UIKit 的任何方法 → 需要

- ❌ 純粹的資料處理 → 不需要

- ❌ 網路請求 → 不需要

- ❌ 資料庫查詢 → 不需要

---

## 9\. 進階：nonisolated 關鍵字

有時候你的 class 標記了 `@MainActor`，但某些方法不需要在主執行緒：

```swift
@MainActor
class ViewController: UIViewController {
    
    // 這個方法在主執行緒
    func updateUI() {
        label.text = "更新"
    }
    
    // 這個方法不需要在主執行緒
    nonisolated func calculateSum() -> Int {
        return 1 + 1  // 純計算，不碰 UI
    }
}
```

---

## 10\. 實際完整範例

```swift
// Service 層：不需要 @MainActor
class UserService {
    func fetchUser() async throws -> User {
        let (data, _) = try await URLSession.shared.data(from: userURL)
        return try JSONDecoder().decode(User.self, from: data)
    }
}

// ViewController：需要 @MainActor
@MainActor
class ProfileViewController: UIViewController {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var loadingView: UIActivityIndicatorView!
    
    private let userService = UserService()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        Task {
            await loadProfile()
        }
    }
    
    // 整個方法在主執行緒執行
    func loadProfile() async {
        // 開始載入
        loadingView.startAnimating()
        
        do {
            // 這裡會切到背景（await 暫停點）
            let user = try await userService.fetchUser()
            
            // 這裡自動回到主執行緒（因為方法是 @MainActor）
            nameLabel.text = user.name
            emailLabel.text = user.email
            
        } catch {
            showError(error)
        }
        
        // 結束載入
        loadingView.stopAnimating()
    }
    
    func showError(_ error: Error) {
        let alert = UIAlertController(
            title: "錯誤",
            message: error.localizedDescription,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "確定", style: .default))
        present(alert, animated: true)
    }
}
```

---

希望這樣解釋清楚了 `@MainActor` 的使用時機！🎯

**核心原則就是：只要會碰到 UI，就加 @MainActor**