# Android Studio啟動載入Cucumber步驟

### **🔴 步驟 1**：在 Android Studio **安裝 Cucumber + Appium 相關依賴（假設Appium相關元件已安裝）**

`app/``build.gradle` 使用 `testImplementation` 來加入 Cucumber 相關依賴

### 🔴 **步驟 2**：**設定 Appium Server & 連接 Android 設備**

```
IOSAppiumApplication.kt
try {
    Companion.driver = IOSDriver(URL("http://127.0.0.1:4723/"), capabilities)
}
```

### 🔴 **步驟 3**：撰寫 **`.feature` 測試案例（Gherkin 語法）**

在 **`src/test/resources/`** 目錄下建立 `login.feature`

### 🔴 **步驟 4**：撰寫 **Step Definitions（Java 操作 UI 測試）**

在 **`src/test/kotlin`/com.thomson.appiumtest/stepdefenitions** 目錄下建立 **SKBankLoginFeatureStepDefinitions.kt**，用來實作對應的測試步驟。

### 🔴 **步驟 5**：建立 **Cucumber Runner 測試執行器**

```
CucumberTest.kt
@CucumberOptions(
    plugin = ["pretty", "html:target/cucumber-report.html"],
    features = ["src/test/resources"] 👉 讀取所有feature測試案例
)
```

這樣，Cucumber 會：

- **讀取 `features` 目錄下的所有 `.feature` 測試案例**

- **將步驟與 `steps` 內的 Step Definitions 連接**

   - login.feature <-> SKBankLoginFeatureStepDefinitions.kt

- **執行測試，並產生 HTML 測試報告**

   - cucumber-report.html

# UI自動化測試 - 專案心智圖

![Cursor\_和\_行動銀行\_smmx.png.jpg](./Android%20Studio啟動載入Cucumber步驟-assets/Cursor_和_行動銀行_smmx.png.jpg)


