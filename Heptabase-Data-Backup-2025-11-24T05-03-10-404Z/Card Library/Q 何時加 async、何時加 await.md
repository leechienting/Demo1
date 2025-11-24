# Q 何時加 async、何時加 await

# 白話理解：何時加 async、何時加 await

讓我用最簡單的方式說明：

## 核心概念

**async（非同步）**= 「我是一個會花時間的函式」的標記
**await（等待）**= 「我要等這件事做完」的動作

---

## 何時加 async？

### 簡單規則：**當你的函式裡面有 await 時，就要加 async**

```swift
// ❌ 錯誤：有 await 但沒有 async
func downloadImage(from url: URL) -> UIImage {
    let data = await URLSession.shared.data(from: url)  // 編譯錯誤！
    return UIImage(data: data)
}

// ✅ 正確：有 await 就要加 async
func downloadImage(from url: URL) async -> UIImage {
    let data = await URLSession.shared.data(from: url)
    return UIImage(data: data)
}
```

### 白話解釋：

想像你是餐廳服務生：

```swift
// 你要告訴客人：「這道菜需要等一下」
func 做牛排() async -> 牛排 {  // async 表示：這道菜要等
    let 肉 = await 煎肉(5分鐘)   // await 表示：實際在等
    let 配菜 = await 準備配菜()
    return 牛排(肉: 肉, 配菜: 配菜)
}
```

**async** 就像菜單上標記「需時 20 分鐘」，是一個**聲明**
**await** 就像廚房裡實際在**計時等待**

---

## 何時加 await？

### 簡單規則：**當你呼叫一個 async 函式時，就要加 await**

```swift
// 這是一個 async 函式
func fetchData() async -> Data {
    // ...
}

// ❌ 錯誤：呼叫 async 函式沒加 await
func loadData() async {
    let data = fetchData()  // 編譯錯誤！
}

// ✅ 正確：呼叫 async 函式要加 await
func loadData() async {
    let data = await fetchData()  // 正確
}
```

### 白話解釋：

就像你打電話給朋友：

```swift
// 朋友說：「我在忙，等我一下」（這是 async 函式）
func 朋友接電話() async -> String {
    return "我好了"
}

// 你要等他（用 await）
func 打電話() async {
    let 回應 = await 朋友接電話()  // 等待朋友回應
    print(回應)
}
```

如果你**忘記 await**，就像你打電話但立刻掛斷，根本沒等對方說話！

---

## 常見情境對照

### 情境 1：下載圖片

```swift
// 定義：我是會花時間的函式 → 加 async
func downloadImage(url: URL) async throws -> UIImage {
    
    // 呼叫：這個會花時間，我要等 → 加 await
    let (data, _) = try await URLSession.shared.data(from: url)
    
    // 一般操作：不花時間，不用等 → 不加 await
    guard let image = UIImage(data: data) else {
        throw ImageError.invalid
    }
    
    return image
}
```

### 情境 2：登入流程

```swift
// 定義：登入要花時間 → 加 async
func login(email: String, password: String) async throws -> User {
    
    // 步驟 1：呼叫網路請求（花時間）→ 加 await
    let token = try await AuthAPI.login(email: email, password: password)
    
    // 步驟 2：取得用戶資料（花時間）→ 加 await  
    let user = try await UserAPI.fetchProfile(token: token)
    
    // 步驟 3：儲存到本地（快速操作）→ 不加 await
    UserDefaults.standard.set(token, forKey: "token")
    
    return user
}
```

### 情境 3：在 UIViewController 中使用

```swift
class MyViewController: UIViewController {
    
    @IBAction func loginButtonTapped(_ sender: UIButton) {
        // 問題：這不是 async 函式，怎麼呼叫 async 函式？
        // 答案：用 Task 包起來
        
        Task {
            // Task 內部是 async 環境，可以用 await
            let user = await login(email: "test@test.com", password: "123")
            
            // 更新 UI
            nameLabel.text = user.name
        }
    }
}
```

---

## 記憶口訣

### 📌 async 口訣：「我會慢，請標記我」

```swift
func 我會花時間() async {  // 要標記 async
    // 裡面有耗時操作
}
```

### 📌 await 口訣：「你會慢，我要等你」

```swift
let 結果 = await 你會花時間()  // 要等待 await
```

---

## 實際判斷流程圖

```
你在寫一個函式
    ↓
問：這個函式裡面有沒有 await？
    ↓
有 → 函式簽名加 async
沒有 → 不用加 async

---

你在呼叫一個函式
    ↓
問：這個函式有沒有標記 async？
    ↓
有 → 呼叫時加 await
沒有 → 不用加 await
```

---

## 常見錯誤與理解

### ❌ 錯誤 1：有 await 忘記加 async

```swift
func loadData() {  // 缺少 async
    let data = await fetchData()  // 編譯錯誤
}
```

**就像**：你在普通辦公室（同步函式）試圖「等待」，但普通辦公室不允許等待！

### ❌ 錯誤 2：呼叫 async 忘記加 await

```swift
func loadData() async {
    let data = fetchData()  // 缺少 await
}
```

**就像**：你叫外賣但沒等外賣到就開始吃，結果吃到空氣！

### ✅ 正確範例

```swift
// 1. 定義 async 函式
func fetchData() async -> Data {
    // ...
}

// 2. 在另一個 async 函式中呼叫
func loadData() async {
    let data = await fetchData()  // 正確
}

// 3. 在非 async 環境（如 ViewController）中呼叫
func buttonTapped() {
    Task {
        let data = await fetchData()  // 用 Task 包起來
    }
}
```

---

## 最後總結

- **async** = 函式**定義時**加，表示「我會花時間」

- **await** = 函式**呼叫時**加，表示「我要等你」

**檢查清單：**

1. 函式裡有 `await` → 函式加 `async`

2. 呼叫 `async` 函式 → 加 `await`

3. 在非 async 環境 → 用 `Task { }` 包起來

就這麼簡單！🎯