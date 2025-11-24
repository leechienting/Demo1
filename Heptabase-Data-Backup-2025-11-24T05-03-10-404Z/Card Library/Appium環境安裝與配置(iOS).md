# Appium環境安裝與配置(iOS)

### 安裝Appium之前

- **Homebrew**（MacOS 的包管理器）

   ```plain
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

- **Node.js**（Appium 是基於 Node.js 的）

   ```plain
   brew install node
   ```

- **Xcode**（用於 iOS 測試，包含 iOS 模擬器和 Xcode Command Line Tools）

   - 安裝 Xcode Command Line Tools：

   ```plain
   xcode-select --install
   
   // 若已安裝，會出現以下文字
   xcode-select: note: Command line tools are already installed. Use "Software Update" in System Settings or the softwareupdate command line interface to install updates
   ```

- **Android Studio**（用於 Android 測試）

### 安裝Appium

```plain
npm install -g appium

安裝完成後確認：
appium --version
```

### 安裝Appium Desktop(注意：不建議使用，2.x版改用終端機執行 appium)

- 到Appium官網安裝 Appium-mac-<version>.dmg (目前 V1.22.3-4)

- 注意：若無法打開APP，可能是隱私權的問題，請到『設定』→『隱私權與安全性』來強制打開。

開啟（**1\.x版，已不建議使用**）

![Appium.png](./Appium環境安裝與配置(iOS)-assets/Appium.png)

Start Server

![Appium.png](./Appium環境安裝與配置(iOS)-assets/Appium.png)



方法二：由終端機執行（**2\.x版改用此方法啟動**）

```plain
appium
```

---

### 配置iOS環境

- 安裝 **Carthage**（用於 iOS 測試）

```plain
brew install carthage
```

### **安裝 Xcuitest Driver**

- Appium 將 Appium Server 及 Appium Driver 切開，如此一來可以安裝該次測試需要測試的 driver 即可。

```plain
appium driver install xcuitest
```

安裝完成：

![chientinglee\_—\_-zsh\_—\_80×41.png](./Appium環境安裝與配置(iOS)-assets/chientinglee_—_-zsh_—_80×41.png)



---

### 安裝 Appium-Inspector

- **Appium Inspector** 是一個圖形化工具，用來檢查APP中的 UI 元素，協助你建立和調試自動化測試腳本。

- 通過視覺化界面幫助你**快速定位、模擬用戶操作**和**驗證應用中的元素**，大大簡化了測試腳本的開發與調試流程。

- [github](https://github.com/appium/appium-inspector/releases)

- 注意：若無法打開APP，可能是隱私權的問題，請到『設定』→『隱私權與安全性』來強制打開。