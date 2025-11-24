# WebDriver 與 WebDriverAgent(WDA)的關係

在 Appium 中，概念上可以這麼理解：

- **WebDriver** 是一個標準的協定（protocol），定義了**如何與瀏覽器或移動裝置進行互動**，也就是說它規範了客戶端（例如你的測試程式）如何發出命令，以及伺服器端如何回應這些命令。

- **WebDriverAgent (WDA)** 則是 Appium 用來在 iOS 裝置（或模擬器）上執行自動化操作的一個工具。它是一個用 Xcode 建立的應用程式，運行在 iOS 裝置上，負責接收來自 Appium 伺服器的 WebDriver 命令，再將這些命令轉換為 iOS 平台上的具體操作（例如點擊、滑動、輸入文字等）。

簡單來說：

- **WebDriver** 是一個規範與溝通協定，

- **WebDriverAgent** 是這個規範在 iOS 上的實際落地，扮演橋樑的角色，讓 Appium 可以通過 WebDriver 命令操控 iOS 裝置。

這樣一來，當你使用 Appium 寫自動化測試腳本時，腳本會透過 WebDriver 協定與 Appium 伺服器溝通，而對於 iOS 裝置上的操作，Appium 會利用 WebDriverAgent 來實際執行這些操作。