`xcodebuild failed with code 65` 是 **Appium 無法成功啟動 WebDriverAgent (WDA)** 的錯誤，通常與 **Xcode 設置、權限或簽名問題** 有關。讓我們一步步解決它：

---

## 🔍 **步驟 1：檢查 WebDriverAgent (WDA) 是否可手動編譯**

Appium 會使用 **WebDriverAgent (WDA)** 來與 iOS 設備溝通。首先，先檢查它能否手動編譯成功：

1. **打開 WebDriverAgent 專案**

   ```
   bash
   ```

   複製編輯

   `open /Applications/``[Appium.app/Contents/Resources/app/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj](Appium.app/Contents/Resources/app/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj)`

   **或者，如果你是用 npm 安裝的 Appium**：

   ```
   bash
   ```

   複製編輯

   `open /usr/local/lib/node_modules/appium/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj`

2. **選擇正確的 Team & 簽名**

   - 在 Xcode 內，選擇 **WebDriverAgentRunner** target。

   - 進入 `Signing & Capabilities`，確保：

      - **Team** 選擇了你 Apple ID 的 Team。

      - **Automatically manage signing** 被勾選。

3. **測試手動編譯**

   - 選擇你的 **iOS 真機**（如果是模擬器，選擇 iPhone 模擬器）。

   - 嘗試點擊 **Build**（`⌘ + B`）。

   - 如果失敗，記錄錯誤訊息。

---

## 🔍 **步驟 2：確認 Appium 設定**

如果 WDA 手動編譯沒問題，確保 Appium 正確啟動：

```
bash
```

複製編輯

`appium server --use-plugins=element-wait --allow-insecure=xcuitest`

或者，確保你的 WebDriverAgent 已安裝：

```
bash
```

複製編輯

`npm install -g appium-webdriveragent`

---

## 🔍 **步驟 3：重設 WebDriverAgent**

如果還是失敗，你可以刪除並重新安裝 WebDriverAgent：

```
bash
```

複製編輯

`rm -rf /usr/local/lib/node_modules/appium/node_modules/appium-webdriveragent npm install -g appium-webdriveragent`

然後再試一次。

---

## 🔍 **步驟 4：確保 `iproxy` 在運行**

Appium 需要 **iproxy** 來轉發本地 8100 端口到設備：

```
bash
```

複製編輯

`brew install libimobiledevice iproxy 8100 8100 &`

再嘗試啟動 Appium。

---

## 🔍 **步驟 5：提供 `derivedDataPath` 參數**

有時候 Xcode 會因為 `DerivedData` 路徑問題導致 `Code 65`，可以試試這個：

```
python
```

複製編輯

`desired_caps = { "platformName": "iOS", "deviceName": "iPhone 14", "automationName": "XCUITest", "app": "/path/to/``[your.app](your.app)``", "wdaLocalPort": 8100, "useNewWDA": True, "derivedDataPath": "/Users/你的mac用戶名稱/Library/Developer/Xcode/DerivedData" }`

確保該路徑 **存在且有寫入權限**。

---

## 🔍 **步驟 6：手動啟動 WDA**

如果仍然出錯，手動啟動 WebDriverAgentRunner 來查看更詳細的錯誤：

```
bash
```

複製編輯

`xcodebuild -project WebDriverAgent.xcodeproj \ -scheme WebDriverAgentRunner \ -destination 'id=你的設備UDID' \ test`

> **如何獲取設備 UDID**

```
bash
```

複製編輯

`idevice_id -l`

如果 `xcodebuild` 本身無法成功編譯，則需要 **先解決 Xcode 的問題**。

---

## ✅ **總結**

1. **手動編譯 WebDriverAgentRunner**（確保 Team 設定正確）。

2. **確認 Appium 正確安裝**（重新安裝 `appium-webdriveragent`）。

3. **確保 `iproxy` 運行**（轉發 8100 端口）。

4. **嘗試 `derivedDataPath` 修正 Code 65 問題**。

5. **手動啟動 WDA 來查看更詳細錯誤**。

試試這些步驟，看看能不能解決！如果還有錯誤日誌，貼出來我幫你分析 🚀