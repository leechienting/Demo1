# Appium基礎概念

### 什麼是Appimu

- Appium 提供一個相當優秀的框架，他是一個 Client/Server 的框架，提供一套完整的 Protocol 讓你可以去操控 iOS/Android/Windows app，不管是模擬器或者實體機器都可以運作，功能十分強大。

- 通過**編寫測試腳本**來模擬用戶操作，如點擊按鈕、輸入文字、滾動列表等。

- 可以用不同的編程語言編寫測試腳本，包括 Java、Python、Ruby、C# 等。

### 基本原理 

- Appium 通過 [Web Driver .md](./Web%20Driver%20.md) 協議來與設備或模擬器進行互動。WebDriver 是一個跨平台的 API，用來控制瀏覽器和行動應用。

### 工作方式

- 基本上是由 **Appium Server** 和 **Appium Client** 兩部分組成：

   - **Appium Server**：是 **Appium 的核心**，它接收來自客戶端的請求並將這些請求轉換成對應的移動設備操作指令。你可以把它想像成一個中介，負責和終端設備溝通。

   - **Appium Client**：是**用戶寫測試腳本的地方**，你可以選擇使用你喜歡的編程語言來編寫測試腳本。Appium 客戶端通過 **HTTP** 請求將操作發送到 Appium 伺服器。

### 運作方式

- 如下圖所示，Appium Server 會與 Appium XCUITest Driver 做溝通，Appium XCUITest Driver 通過 WDA 與 iOS 設備進行溝通，這部分相較於 Android 比較特別的地方是 WDA 並不是由 Apple 主導的，而是一個第三方工具，原先由 Facebook 做維護的，現在改由 Appium 提供，下面我們針對 Appium-XCUITest-Driver、WDA、XCUITest 的愛恨糾葛做更詳細的介紹：

   ![20168859Qt6FHfyHGy.png](./Appium基礎概念-assets/20168859Qt6FHfyHGy.png)

- 下圖以iOS為例

   ![AI\_—\__25__Robot_Framework\_結合\_Appium\_進行\_App\_自動化測試\_-\_Appium_iOS\_環境安裝\_-\_iT\_邦幫忙\_\_一起幫忙解決難題，拯救\_IT\_人的一天.png](./Appium基礎概念-assets/AI_—__25__Robot_Framework_結合_Appium_進行_App_自動化測試_-_Appium_iOS_環境安裝_-_iT_邦幫忙__一起幫忙解決難題，拯救_IT_人的一天.png)

- **Appium-XCUITest-Driver**

   - 主要用於驅動 **XCUITest** 來執行 **iOS UI 測試**，讓 **Appium Server** 能夠控制 **iOS 應用程式** 進行測試。

   - 透過 **WebDriverAgent (WDA)** 與 **iOS 設備** 通信。

   - **Appium Server** → **Appium-XCUITest-Driver** → **WDA** → **iOS 設備**。

   - 優點：允許測試人員使用 **Appium API** 來測試 iOS，而 **無需學習 XCUITest、並支援跨平台**。

- **WebDriverAgent (WDA)**

   - 由 **Facebook 開發的開源項目，**為 **Appium 與 iOS 設備的橋樑**。

      提供**標準的 WebDriver API** 來控制 iOS 設備。

   - 使用 **XCTest.framework** 調用 Apple API。

   - 在 **iOS 設備上運行 HTTP 伺服器**：

      - 接收 **Appium 發送的 HTTP 請求**。

      - 轉換為 iOS 設備可理解的操作。

   - 支援**實體裝置與模擬器**，測試適用範圍廣泛。

   - Facebook 已停止維護，建議改用 **Appium 社群版本的 WDA**。

- **XCUITest**

   - **Apple 官方提供** 的 UI 測試框架。

   - 透過 **XCUITest-Driver**，可與 **Appium 整合**。

### 特性

- 可用不同語言編寫測試腳本，Appium 支援 Java、Python、JavaScript、Ruby、C# 等多種語言。

- 不用修改App端的程式。

- 可與各種雲端測試平台整合（如 Sauce Labs、BrowserStack）

### 元素定位

- 定位 UI 元素（如按鈕、文本框等）。讓你可以準確地找到並操作應用中的 UI 元素。

- 元素定位方式包括 **ID、XPath、Class Name、Accessibility ID** 等。

- **Driver**：Appium 提供了不同平台的 **Driver** 來控制相應平台的設備。

   - iOS 用的是 **XCUITestDriver。**

   -  Android 用的是 **UIAutomator2Driver**。

### 測試腳本結構（初始、交互、結果）

- **啟動應用**：測試腳本通常從**啟動應用**開始，這樣你就能控制應用的狀態。

- **交互操作**：使用測試腳本**模擬用戶操作**，比如點擊按鈕、填寫表單、滑動屏幕等。

- **驗證結果**：執行一些斷言來**驗證應用的行為是否符合預期**，比如檢查某個元素是否顯示，或檢查應用的某些文本是否正確。

### 