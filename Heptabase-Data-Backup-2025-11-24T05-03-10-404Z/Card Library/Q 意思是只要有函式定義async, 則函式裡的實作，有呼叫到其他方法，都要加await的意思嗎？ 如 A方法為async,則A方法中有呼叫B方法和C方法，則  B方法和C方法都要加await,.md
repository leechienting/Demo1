# Q 意思是只要有函式定義async, 則函式裡的實作，有呼叫到其他方法，都要加await的意思嗎？ 如 A方法為async,則A方法中有呼叫B方法和C方法，則  B方法和C方法都要加await,我的理解對嗎？

# ❌不對！這是常見的誤解

讓我澄清：**不是所有呼叫都要加 await**

## 正確理解

**只有當 B 方法或 C 方法本身是 async 時，才需要加 await**

---

## 實際範例說明

```swift
// A 方法是 async
func A方法() async -> String {
    
    // B 方法是 async → 需要 await ✅
    let result1 = await B方法()
    
    // C 方法不是 async → 不需要 await ✅
    let result2 = C方法()
    
    // D 方法不是 async → 不需要 await ✅
    let result3 = D方法()
    
    return result1 + result2 + result3
}

// B 方法：是 async（會花時間）
func B方法() async -> String {
    let (data, _) = try! await URLSession.shared.data(from: URL(string: "...")!)
    return String(data: data, encoding: .utf8) ?? ""
}

// C 方法：不是 async（很快完成）
func C方法() -> String {
    return "這是立即返回的"
}

// D 方法：不是 async（很快完成）
func D方法() -> String {
    let number = 1 + 1
    return "\(number)"
}
```

---

## 判斷規則

### 📋 簡單判斷法

看**被呼叫的方法**有沒有 `async` 關鍵字：

```swift
func 某方法() async {  // ← 看這裡有沒有 async
    // ...
}
```

- **有 async** → 呼叫時加 `await`

- **沒有 async** → 呼叫時**不加** `await`

---

## 更完整的例子

```swift
class UserService {
    
    // 這是 async 方法
    func fetchUserProfile() async throws -> User {
        
        // 1. 呼叫網路 API（是 async）→ 需要 await
        let data = try await NetworkManager.request(endpoint: "/user")
        
        // 2. 解析 JSON（不是 async，很快）→ 不需要 await
        let user = try parseUser(from: data)
        
        // 3. 儲存到快取（不是 async，很快）→ 不需要 await
        saveToCache(user)
        
        // 4. 記錄日誌（不是 async，很快）→ 不需要 await
        logUserLogin(user.id)
        
        // 5. 更新資料庫（是 async，耗時）→ 需要 await
        try await Database.save(user)
        
        return user
    }
    
    // 不是 async（立即完成）
    private func parseUser(from data: Data) throws -> User {
        return try JSONDecoder().decode(User.self, from: data)
    }
    
    // 不是 async（立即完成）
    private func saveToCache(_ user: User) {
        UserDefaults.standard.set(user.id, forKey: "userId")
    }
    
    // 不是 async（立即完成）
    private func logUserLogin(_ userId: String) {
        print("User \(userId) logged in")
    }
}
```

---

## 為什麼會有這個誤解？

### 你可能這樣想：

> 「A 是 async，所以 A 裡面的一切都要等，因此都要 await」

### 實際情況是：

> 「A 是 async，代表 A **可能**會等某些事情。但不是 A 裡面的每件事都要等」

---

## 生活化比喻

### 🍳 煮早餐的例子

```swift
// 準備早餐（是 async，因為煎蛋要等）
func 準備早餐() async -> 早餐 {
    
    // 煎蛋要等（是 async）→ 需要 await
    let 蛋 = await 煎蛋(時間: 3分鐘)
    
    // 拿麵包（不用等，立即完成）→ 不需要 await
    let 麵包 = 拿麵包()
    
    // 倒牛奶（不用等，立即完成）→ 不需要 await
    let 牛奶 = 倒牛奶()
    
    // 烤吐司要等（是 async）→ 需要 await
    let 吐司 = await 烤吐司(時間: 2分鐘)
    
    return 早餐(蛋: 蛋, 麵包: 麵包, 牛奶: 牛奶, 吐司: 吐司)
}

// 這個要等 → 是 async
func 煎蛋(時間: Int) async -> 蛋 {
    // 模擬等待
    try? await Task.sleep(nanoseconds: UInt64(時間) * 1_000_000_000)
    return 蛋()
}

// 這個不用等 → 不是 async
func 拿麵包() -> 麵包 {
    return 麵包()  // 立即完成
}

// 這個不用等 → 不是 async
func 倒牛奶() -> 牛奶 {
    return 牛奶()  // 立即完成
}

// 這個要等 → 是 async
func 烤吐司(時間: Int) async -> 吐司 {
    try? await Task.sleep(nanoseconds: UInt64(時間) * 1_000_000_000)
    return 吐司()
}
```

---

## 實際開發案例

```swift
class LoginViewController: UIViewController {
    
    @IBAction func loginButtonTapped() {
        Task {
            await performLogin()
        }
    }
    
    // 這是 async 方法
    func performLogin() async {
        
        // 1. 顯示載入畫面（不是 async）→ 不需要 await
        showLoadingView()
        
        // 2. 取得輸入內容（不是 async）→ 不需要 await
        let email = emailTextField.text ?? ""
        let password = passwordTextField.text ?? ""
        
        // 3. 驗證格式（不是 async）→ 不需要 await
        guard isValidEmail(email) else {
            showError("Email 格式錯誤")
            return
        }
        
        do {
            // 4. 呼叫登入 API（是 async）→ 需要 await
            let token = try await AuthService.login(email: email, password: password)
            
            // 5. 儲存 Token（不是 async）→ 不需要 await
            TokenManager.save(token)
            
            // 6. 取得用戶資料（是 async）→ 需要 await
            let user = try await UserService.fetchProfile(token: token)
            
            // 7. 更新 UI（不是 async）→ 不需要 await
            navigateToHomeScreen(user: user)
            
        } catch {
            // 8. 顯示錯誤（不是 async）→ 不需要 await
            showError(error.localizedDescription)
        }
        
        // 9. 隱藏載入畫面（不是 async）→ 不需要 await
        hideLoadingView()
    }
    
    // 以下都不是 async 方法
    func showLoadingView() { /* ... */ }
    func hideLoadingView() { /* ... */ }
    func isValidEmail(_ email: String) -> Bool { /* ... */ }
    func showError(_ message: String) { /* ... */ }
    func navigateToHomeScreen(user: User) { /* ... */ }
}
```

---

## 如何判斷一個方法是不是 async？

### 方法 1：看方法定義

```swift
func 方法名() async -> 返回值  // ← 有 async = 是 async 方法
func 方法名() -> 返回值          // ← 沒有 async = 不是 async 方法
```

### 方法 2：在 Xcode 中按住 Command 點擊方法名

會跳到定義處，看有沒有 `async`

### 方法 3：編譯器會告訴你

```swift
func test() async {
    let result = someMethod()  
    // 如果 someMethod 是 async，編譯器會報錯：
    // "Expression is 'async' but is not marked with 'await'"
}
```

---

## 總結對比

### ❌ 你原本的理解（錯誤）

```swift
func A方法() async {
    let b = await B方法()  // 不管 B 是不是 async，都加 await
    let c = await C方法()  // 不管 C 是不是 async，都加 await
}
```

### ✅ 正確的理解

```swift
func A方法() async {
    let b = await B方法()  // B 是 async → 需要 await
    let c = C方法()         // C 不是 async → 不需要 await
}
```

---

## 記憶口訣

**「await 不是看外面（調用者），而是看裡面（被調用者）」**

- 看**被呼叫的方法**有沒有 `async`

- **有** `async` → 加 `await`

- **沒有** `async` → 不加 `await`

希望這樣解釋清楚了！🎯