# Q 可以給我更多範例嗎？

# 實際例子（UIKit 版本）

讓我提供幾個在 UIKit 專案中使用 async/await 的實際場景：

## 例子 1：圖片下載與快取（UITableView/UICollectionView）

```swift
// 傳統 callback 方式 - 容易出現競態條件
class ImageCell: UICollectionViewCell {
    private var imageView = UIImageView()
    private var currentLoadTask: URLSessionDataTask?
    
    func configure(with url: URL) {
        imageView.image = nil
        
        // 取消之前的請求
        currentLoadTask?.cancel()
        
        currentLoadTask = URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
            guard let self = self,
                  let data = data,
                  let image = UIImage(data: data) else {
                return
            }
            
            DispatchQueue.main.async {
                // 問題：這時 cell 可能已經被重用了
                self.imageView.image = image
            }
        }
        currentLoadTask?.resume()
    }
}

// 使用 async/await 改寫 - 更安全、更簡潔
class ImageCell: UICollectionViewCell {
    private var imageView = UIImageView()
    private var loadTask: Task<Void, Never>?
    
    func configure(with url: URL) {
        imageView.image = nil
        
        // 取消之前的任務
        loadTask?.cancel()
        
        // 創建新的非同步任務
        loadTask = Task {
            do {
                let image = try await ImageLoader.shared.loadImage(from: url)
                
                // 檢查任務是否被取消（cell 被重用）
                guard !Task.isCancelled else { return }
                
                // 自動在主執行緒更新 UI（因為 Task 繼承了呼叫端的執行緒上下文）
                imageView.image = image
            } catch {
                guard !Task.isCancelled else { return }
                imageView.image = UIImage(systemName: "exclamationmark.triangle")
            }
        }
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        loadTask?.cancel()
        imageView.image = nil
    }
}

// ImageLoader 實作
class ImageLoader {
    static let shared = ImageLoader()
    private let cache = NSCache<NSURL, UIImage>()
    
    func loadImage(from url: URL) async throws -> UIImage {
        // 先檢查快取
        if let cachedImage = cache.object(forKey: url as NSURL) {
            return cachedImage
        }
        
        // 下載圖片
        let (data, _) = try await URLSession.shared.data(from: url)
        
        guard let image = UIImage(data: data) else {
            throw ImageLoadError.invalidData
        }
        
        // 存入快取
        cache.setObject(image, forKey: url as NSURL)
        return image
    }
}

enum ImageLoadError: Error {
    case invalidData
}
```

## 例子 2：登入流程（ViewController）

```swift
class LoginViewController: UIViewController {
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    
    private var loginTask: Task<Void, Never>?
    
    @IBAction func loginButtonTapped(_ sender: UIButton) {
        // 防止重複點擊
        guard loginTask == nil else { return }
        
        guard let email = emailTextField.text,
              let password = passwordTextField.text,
              !email.isEmpty,
              !password.isEmpty else {
            showAlert(message: "請輸入帳號密碼")
            return
        }
        
        loginTask = Task {
            await performLogin(email: email, password: password)
        }
    }
    
    @MainActor // 確保整個函式在主執行緒執行
    private func performLogin(email: String, password: String) async {
        // 更新 UI - 開始載入
        setLoading(true)
        
        do {
            // 步驟 1：登入
            let authToken = try await AuthService.shared.login(
                email: email,
                password: password
            )
            
            // 步驟 2：取得使用者資料
            let user = try await UserService.shared.fetchUserProfile(token: authToken)
            
            // 步驟 3：下載使用者偏好設定
            let preferences = try await PreferencesService.shared.fetch(for: user.id)
            
            // 步驟 4：初始化本地資料庫
            try await LocalDatabase.shared.initialize(user: user)
            
            // 全部成功 - 導航到主畫面
            navigateToMainScreen(user: user, preferences: preferences)
            
        } catch let error as AuthError {
            handleAuthError(error)
        } catch {
            showAlert(message: "登入失敗：\(error.localizedDescription)")
        }
        
        // 更新 UI - 結束載入
        setLoading(false)
        loginTask = nil
    }
    
    private func setLoading(_ isLoading: Bool) {
        loginButton.isEnabled = !isLoading
        emailTextField.isEnabled = !isLoading
        passwordTextField.isEnabled = !isLoading
        
        if isLoading {
            activityIndicator.startAnimating()
        } else {
            activityIndicator.stopAnimating()
        }
    }
    
    private func handleAuthError(_ error: AuthError) {
        switch error {
        case .invalidCredentials:
            showAlert(message: "帳號或密碼錯誤")
        case .accountLocked:
            showAlert(message: "帳號已被鎖定，請聯繫客服")
        case .networkError:
            showAlert(message: "網路連線錯誤")
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(
            title: "提示",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "確定", style: .default))
        present(alert, animated: true)
    }
    
    deinit {
        // ViewController 釋放時取消未完成的任務
        loginTask?.cancel()
    }
}

// AuthService 實作
class AuthService {
    static let shared = AuthService()
    
    func login(email: String, password: String) async throws -> String {
        let url = URL(string: "https://api.example.com/auth/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AuthError.networkError
        }
        
        switch httpResponse.statusCode {
        case 200:
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            guard let token = json?["token"] as? String else {
                throw AuthError.invalidResponse
            }
            return token
        case 401:
            throw AuthError.invalidCredentials
        case 423:
            throw AuthError.accountLocked
        default:
            throw AuthError.networkError
        }
    }
}

enum AuthError: Error {
    case invalidCredentials
    case accountLocked
    case networkError
    case invalidResponse
}
```

## 例子 3：並發載入多個資料源（Dashboard）

```swift
class DashboardViewController: UIViewController {
    @IBOutlet weak var weatherLabel: UILabel!
    @IBOutlet weak var stockLabel: UILabel!
    @IBOutlet weak var newsLabel: UILabel!
    @IBOutlet weak var refreshButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 使用 Task 在 UIKit 生命週期中啟動非同步操作
        Task {
            await loadDashboardData()
        }
    }
    
    @IBAction func refreshButtonTapped(_ sender: UIButton) {
        Task {
            await loadDashboardData()
        }
    }
    
    // 並發載入多個資料源
    @MainActor
    private func loadDashboardData() async {
        refreshButton.isEnabled = false
        
        // 使用 async let 並發執行多個請求
        async let weather = WeatherService.shared.fetchWeather()
        async let stock = StockService.shared.fetchStockPrice()
        async let news = NewsService.shared.fetchLatestNews()
        
        do {
            // 等待所有請求完成（並發執行，不是依序執行）
            let (weatherData, stockData, newsData) = try await (weather, stock, news)
            
            // 更新 UI
            weatherLabel.text = "天氣：\(weatherData.temperature)°C"
            stockLabel.text = "台積電：\(stockData.price)"
            newsLabel.text = "最新：\(newsData.headline)"
            
        } catch {
            showError(error)
        }
        
        refreshButton.isEnabled = true
    }
    
    private func showError(_ error: Error) {
        let alert = UIAlertController(
            title: "載入失敗",
            message: error.localizedDescription,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "確定", style: .default))
        present(alert, animated: true)
    }
}
```

## 例子 4：批次操作與進度更新

```swift
class FileUploadViewController: UIViewController {
    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var uploadButton: UIButton!
    
    private var uploadTask: Task<Void, Never>?
    private let filesToUpload: [URL] = [] // 假設有檔案清單
    
    @IBAction func uploadButtonTapped(_ sender: UIButton) {
        uploadTask = Task {
            await uploadFiles()
        }
    }
    
    @MainActor
    private func uploadFiles() async {
        uploadButton.isEnabled = false
        progressView.progress = 0
        
        let total = filesToUpload.count
        var completed = 0
        
        // 使用 TaskGroup 控制並發數量
        await withTaskGroup(of: Result<Void, Error>.self) { group in
            var activeUploads = 0
            let maxConcurrent = 3 // 最多同時上傳 3 個檔案
            
            for (index, fileURL) in filesToUpload.enumerated() {
                // 等待有空閒槽位
                while activeUploads >= maxConcurrent {
                    _ = await group.next()
                    activeUploads -= 1
                    completed += 1
                    updateProgress(completed: completed, total: total)
                }
                
                // 檢查是否被取消
                if Task.isCancelled {
                    statusLabel.text = "上傳已取消"
                    break
                }
                
                // 新增上傳任務
                group.addTask {
                    await self.uploadFile(fileURL)
                }
                activeUploads += 1
                statusLabel.text = "正在上傳 \(index + 1)/\(total)"
            }
            
            // 等待剩餘任務完成
            for await result in group {
                completed += 1
                updateProgress(completed: completed, total: total)
                
                if case .failure(let error) = result {
                    print("上傳失敗：\(error)")
                }
            }
        }
        
        statusLabel.text = "上傳完成"
        uploadButton.isEnabled = true
    }
    
    private func uploadFile(_ fileURL: URL) async -> Result<Void, Error> {
        do {
            try await FileUploadService.shared.upload(fileURL)
            return .success(())
        } catch {
            return .failure(error)
        }
    }
    
    private func updateProgress(completed: Int, total: Int) {
        let progress = Float(completed) / Float(total)
        progressView.progress = progress
    }
    
    deinit {
        uploadTask?.cancel()
    }
}
```

## 例子 5：將舊有 Delegate 轉換為 async/await

```swift
// 舊的 Delegate 模式
protocol LocationManagerDelegate: AnyObject {
    func locationManager(_ manager: LocationManager, didUpdateLocation location: CLLocation)
    func locationManager(_ manager: LocationManager, didFailWithError error: Error)
}

// 使用 Continuation 橋接
class LocationManager: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocation, Error>?
    
    override init() {
        super.init()
        manager.delegate = self
    }
    
    // 新的 async 介面
    func requestLocation() async throws -> CLLocation {
        return try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
            manager.requestLocation()
        }
    }
    
    // CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.first {
            continuation?.resume(returning: location)
            continuation = nil
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        continuation?.resume(throwing: error)
        continuation = nil
    }
}

// 在 ViewController 中使用
class MapViewController: UIViewController {
    private let locationManager = LocationManager()
    
    @IBAction func getCurrentLocationTapped(_ sender: UIButton) {
        Task {
            do {
                let location = try await locationManager.requestLocation()
                print("目前位置：\(location.coordinate)")
                // 更新地圖
            } catch {
                showAlert(message: "無法取得位置：\(error.localizedDescription)")
            }
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: "錯誤", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "確定", style: .default))
        present(alert, animated: true)
    }
}
```

這些例子展示了在 UIKit 專案中如何實際運用 async/await，涵蓋了：

- Cell 重用時的任務取消

- 複雜的多步驟流程（登入）

- 並發載入多個資料源

- 批次操作與進度追蹤

- 將舊有的 Delegate/Callback API 橋接到 async/await

每個例子都處理了實際專案中會遇到的問題，如記憶體管理、錯誤處理、UI 更新、任務取消等。