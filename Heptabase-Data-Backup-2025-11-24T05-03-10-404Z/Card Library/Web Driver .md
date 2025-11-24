# Web Driver 

### 什麼是WebDriver

- 它是一個用來控制網頁瀏覽器的 API，最初由 Selenium 提出，後來被各種自動化測試框架（如 Appium）擴展並應用於移動應用測試。

- 它提供了一個統一的接口來與瀏覽器或行動設備交互，使測試腳本可以模擬用戶的行為（例如點擊按鈕、輸入文本、滾動頁面等）。

### 工作原理

- 透過 HTTP 協議和設備上的 **Driver** 進行通信，從而控制設備的行為。這是一個客戶端（測試腳本）和伺服器（Appium 伺服器）之間的請求-回應模型。

- 當你編寫測試腳本並向 WebDriver 發送命令時，這些命令會經過 Appium 伺服器，然後轉換成相應的設備操作（例如，觸發一個點擊事件）。

### 主要組件

- **Driver**：每個平台（Android、iOS）都有對應的 WebDriver 驅動程式，這些驅動程式與平台特定的 API 進行交互，控制設備執行操作。例如，對於 iOS 來說，Appium 使用 **XCUITestDriver**，而對於 Android 則使用 **UIAutomator2Driver**。

- **Commands**：WebDriver 定義了一組標準命令，用來執行常見的操作，如**查找元素、點擊元素、輸入文字**等。

- **Session**：每次測試的開始和結束都會創建一個 WebDriver 會話。這是一個測試過程中的上下文，它存儲了設備狀態、應用狀態等。

### 支援的操作

- UI元素

   - findElement/findElements 找UI元素；click；clear；getText….

- 等待與同步

   - `implicitlyWait`：設定隱式等待時間，等待元素出現。

   - `WebDriverWait`：設置顯示等待，等待某些條件成立後才執行後續操作（例如等待元素可見）。

- 控制設備

   - `swipe` / `scroll`：用來進行**滑動或滾動**操作。

   - `back`：返回操作。

   - `rotate`：控制設備的**橫向或縱向**。

### 與Appium的關係

- Appium 利用 WebDriver 協議來控制移動設備。

- Appium 是建立在 WebDriver 基礎上的自動化框架。它使用 WebDriver 提供的接口來與移動設備進行交互。這樣，無論是執行測試還是編寫測試腳本，開發者都可以像操作 WebDriver 一樣操作 Appium。

- **Appium Server** 充當 WebDriver 伺服器的角色，負責接收來自測試腳本的 HTTP 請求，並將其轉發給對應平台的 **Driver**，從而控制設備執行相應的操作。

![menskool_014e61f7b1.jpg](./Web%20Driver%20-assets/menskool_014e61f7b1.jpg)

---

### 結論

WebDriver 是 Appium 中的一個關鍵技術，它提供了一個標準的 API 來控制移動設備並執行測試操作。通過 WebDriver，Appium 能夠在不同的平台上實現跨設備測試，並讓你使用不同的編程語言編寫測試腳本。理解 WebDriver 的工作原理及其常用操作，能夠幫助你更高效地學習並使用 Appium 進行自動化測試。