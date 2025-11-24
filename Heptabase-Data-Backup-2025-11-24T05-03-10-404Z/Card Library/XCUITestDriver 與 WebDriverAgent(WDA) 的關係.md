# **XCUITestDriver** 與 WebDriverAgent(WDA) **的關係**



iOS 的 WebDriverAgent 並不等同於 XCUITestDriver，但兩者之間有密切的關係：

- **WebDriverAgent (WDA)**

   - 是一個由 Facebook（後來由 Appium 團隊維護）的開源項目，用 Xcode 建構，基於 XCUITest 框架。

   - 它運行在 iOS 裝置（或模擬器）上，負責接收並執行來自 WebDriver 協定的命令，實際控制 iOS 的 UI 操作。

- **XCUITestDriver**

   - 是 Appium 中用來自動化 iOS 裝置的驅動程式（driver），它負責與 WebDriverAgent 進行溝通。

   - 當你使用 Appium 撰寫自動化測試時，XCUITestDriver 會將你的 WebDriver 命令轉發給 WebDriverAgent，再由 WDA 執行具體操作。

**簡單來說，XCUITestDriver 是 Appium 內部的驅動程式，它利用 WebDriverAgent 這個工具來與 iOS 裝置互動，所以雖然兩者功能上有分工，但它們是一起合作完成 iOS 自動化測試工作的。**


