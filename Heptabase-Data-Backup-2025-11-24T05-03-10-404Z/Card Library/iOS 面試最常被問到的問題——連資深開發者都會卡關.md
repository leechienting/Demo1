# iOS 面試最常被問到的問題——連資深開發者都會卡關

[iOS 面試最常被問到的問題——連資深開發者都會卡關 ! 作者：Mobile App Developer ! 2025 年 10 月 ! Medium --- The Most Asked i.pdf](../Card%20Library/iOS%20面試最常被問到的問題——連資深開發者都會卡關%20!%20作者：Mobile%20App%20Developer%20!%202025%20年%2010%20月%20!%20Medium%20---%20The%20Most%20Asked%20i.pdf)

---

## 1\. 文章核心論點

這篇文章深入探討 iOS 面試中最常被問到的問題：「當你點擊 iPhone 上的應用程式圖示時，背後究竟發生了什麼？」作者認為，這個問題考驗的不是開發者對語法的熟悉度，而是對 iOS 系統架構的深層理解。文章強調，資深工程師的真正價值在於能夠超越程式碼本身，清晰解釋系統運作原理，而非僅僅記憶 API。[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A820.8000000000001%2C%22width%22%3A687.705%2C%22height%22%3A71.99999999999989%7D)[\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A2059.2%2C%22width%22%3A621.0300000000001%2C%22height%22%3A72%7D)[\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A582.93%2C%22top%22%3A10972.8%2C%22width%22%3A605.7900000000001%2C%22height%22%3A72.00000000000182%7D)

## 2\. 主要內容架構

### **第一部分：問題背景與重要性**

說明為何這個看似簡單的問題能讓許多資深開發者卡關，因為它觸及日常編寫程式碼層級之下的系統運作領域。[\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A2059.2%2C%22width%22%3A621.0300000000001%2C%22height%22%3A72%7D)

### **第二部分：應用程式啟動的完整流程（核心內容）**

詳細解析從點擊圖示到應用程式顯示的八個關鍵階段：

- SpringBoard 偵測觸控事件

- 核心與 launchd 建立沙盒環境

- dyld 動態連結器載入相依套件

- UIApplicationMain 初始化應用程式

- SceneDelegate 處理視窗與場景

- 應用程式生命週期運作

- SwiftUI 應用程式的啟動方式

- 完整流程的心智模型[\[4\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A2332.8%2C%22width%22%3A400.05000000000007%2C%22height%22%3A57.59999999999991%7D)[\[5\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A2520%2C%22width%22%3A674.37%2C%22height%22%3A72%7D)[\[6\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A590.55%2C%22top%22%3A3340.8%2C%22width%22%3A443.865%2C%22height%22%3A71.99999999999955%7D)[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A3326.4%2C%22width%22%3A674.37%2C%22height%22%3A57.59999999999991%7D)[\[8\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A4046.4000000000005%2C%22width%22%3A417.19500000000005%2C%22height%22%3A57.599999999999454%7D)[\[9\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A4752%2C%22width%22%3A592.455%2C%22height%22%3A72%7D)[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A594.36%2C%22top%22%3A5659.2%2C%22width%22%3A424.81500000000005%2C%22height%22%3A57.600000000000364%7D)[\[11\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A6494.400000000001%2C%22width%22%3A542.925%2C%22height%22%3A57.599999999999454%7D)[\[12\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A7214.4%2C%22width%22%3A607.695%2C%22height%22%3A72%7D)

### **第三部分：面試應對策略**

說明面試官提問的真正目的，以及如何用簡短、結構化的方式展現對系統架構的深刻理解。[\[13\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A8164.799999999999%2C%22width%22%3A470.5350000000002%2C%22height%22%3A72%7D)

### **第四部分：歷史演進與實務建議**

補充 iOS 13 前後架構的變化，並強調深度理解勝過廣度記憶的重要性。[\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A9648%2C%22width%22%3A704.8500000000003%2C%22height%22%3A158.40000000000146%7D)[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A10396.8%2C%22width%22%3A365.76%2C%22height%22%3A100.80000000000109%7D)

## 3\. 關鍵觀點整理

### **• SpringBoard 是應用程式啟動的入口**

- SpringBoard 是 iOS 的私有系統應用程式，負責管理主畫面與應用程式啟動

- 它會偵測觸控事件、識別套件 ID，並判斷應用程式是否已在背景執行

- 若需要啟動新進程，會將請求轉交給系統核心[\[5\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A2520%2C%22width%22%3A674.37%2C%22height%22%3A72%7D)[\[16\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A2635.2%2C%22width%22%3A375.2850000000001%2C%22height%22%3A43.20000000000027%7D)[\[17\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A2966.3999999999996%2C%22width%22%3A493.39499999999987%2C%22height%22%3A86.40000000000009%7D)

### **• 系統核心與 launchd 建立執行環境**

- launchd 守護程式會為應用程式創建沙盒環境

- 設定系統資源（檔案描述符、權限、授權）

- 準備環境變數並連結必要的系統函式庫[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A3326.4%2C%22width%22%3A674.37%2C%22height%22%3A57.59999999999991%7D)[\[18\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A3585.6%2C%22width%22%3A535.305%2C%22height%22%3A100.80000000000018%7D)[\[19\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A624.84%2C%22top%22%3A3686.4%2C%22width%22%3A546.735%2C%22height%22%3A57.59999999999991%7D)

### **• dyld 動態連結器載入相依套件**

- 每個 iOS 應用程式都依賴系統框架（UIKit、Foundation、Swift 運行環境等）

- dyld 負責解析外部框架引用並在記憶體中連結

- 依賴項越多，應用程式啟動時間就越長[\[8\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A4046.4000000000005%2C%22width%22%3A417.19500000000005%2C%22height%22%3A57.599999999999454%7D)[\[20\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A4420.8%2C%22width%22%3A691.5150000000002%2C%22height%22%3A86.39999999999964%7D)[\[21\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A4579.2%2C%22width%22%3A662.9400000000002%2C%22height%22%3A72%7D)

### **• UIApplicationMain 啟動應用程式生命週期**

- 這個單一呼叫讓 UIKit 接手掌控應用程式

- 它會載入 Info.plist、初始化 AppDelegate/SceneDelegate

- 建立主事件循環，監聽用戶輸入、計時器和系統事件[\[9\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A4752%2C%22width%22%3A592.455%2C%22height%22%3A72%7D)[\[22\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A4939.200000000001%2C%22width%22%3A259.08000000000004%2C%22height%22%3A100.79999999999927%7D)[\[23\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A624.84%2C%22top%22%3A5299.2%2C%22width%22%3A674.37%2C%22height%22%3A72%7D)[\[24\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A619.125%2C%22top%22%3A5486.4%2C%22width%22%3A662.94%2C%22height%22%3A57.600000000000364%7D)

### **• SceneDelegate 管理多視窗情境（iOS 13+）**

- iOS 13 引入 UIScene 架構來處理多視窗支援

- SceneDelegate 負責創建 UIWindow 並指派根視圖控制器

- iOS 13 之前，所有功能都由 AppDelegate 統一管理[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A594.36%2C%22top%22%3A5659.2%2C%22width%22%3A424.81500000000005%2C%22height%22%3A57.600000000000364%7D)[\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A9648%2C%22width%22%3A704.8500000000003%2C%22height%22%3A158.40000000000146%7D)

### **• 應用程式生命週期的狀態轉換**

- 未運行 → 非活躍 → 活躍 → 背景 → 暫停

- 每個狀態轉換都會觸發特定的委派方法

- 理解這些鉤子能幫助處理背景任務、狀態恢復等功能[\[11\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A6494.400000000001%2C%22width%22%3A542.925%2C%22height%22%3A57.599999999999454%7D)[\[25\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A624.84%2C%22top%22%3A6667.200000000001%2C%22width%22%3A600.0749999999999%2C%22height%22%3A72%7D)[\[26\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A619.125%2C%22top%22%3A6696%2C%22width%22%3A617.22%2C%22height%22%3A129.59999999999945%7D)[\[27\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A6984%2C%22width%22%3A546.735%2C%22height%22%3A72%7D)

### **• SwiftUI 底層仍使用相同機制**

- SwiftUI 的 @main 結構體本質上封裝了相同流程

- 底層仍會創建 UIApplication 實例並調用 UIApplicationMain()

- 只是透過宣告式語法與生命週期修飾符將其抽象化[\[28\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A7372.8%2C%22width%22%3A674.37%2C%22height%22%3A72%7D)[\[29\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A7790.400000000001%2C%22width%22%3A649.6049999999999%2C%22height%22%3A72%7D)[\[30\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A8035.200000000001%2C%22width%22%3A662.94%2C%22height%22%3A43.19999999999982%7D)

## 4\. 作者的論證邏輯

作者採用**層層遞進的解說方式**來支持其論點：

1. **從問題情境切入**：先描述面試中常見的窘境，建立讀者共鳴[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A820.8000000000001%2C%22width%22%3A687.705%2C%22height%22%3A71.99999999999989%7D)[\[31\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A1958.4%2C%22width%22%3A567.6899999999999%2C%22height%22%3A71.99999999999977%7D)

2. **系統化拆解流程**：將複雜的啟動過程分解為 8 個清晰的階段，每個階段都有具體說明[\[4\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A2332.8%2C%22width%22%3A400.05000000000007%2C%22height%22%3A57.59999999999991%7D)

3. **提供程式碼範例**：穿插 Swift 程式碼片段，幫助開發者理解抽象概念[\[22\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A4939.200000000001%2C%22width%22%3A259.08000000000004%2C%22height%22%3A100.79999999999927%7D)[\[32\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A636.27%2C%22top%22%3A6163.2%2C%22width%22%3A556.26%2C%22height%22%3A129.60000000000036%7D)

4. **補充歷史脈絡**：說明架構演進（iOS 13 前後的變化），增加理解深度[\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A9648%2C%22width%22%3A704.8500000000003%2C%22height%22%3A158.40000000000146%7D)

5. **總結實務價值**：強調這些知識如何幫助開發者在面試中脫穎而出，並提供具體回答範例[\[13\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A8164.799999999999%2C%22width%22%3A470.5350000000002%2C%22height%22%3A72%7D)

作者透過**「問題→原理→應用→總結」**的論證結構，不僅解釋「是什麼」，更說明「為什麼重要」。

## 5\. 可能的爭議或限制

### **• 內容深度與實務應用的平衡**

文章詳細說明系統層級的運作原理，但對於日常開發工作，開發者可能不需要這麼深入的知識。有些讀者可能質疑這些內容的實用性。

### **• 面試導向的學習方式**

文章明確以「通過面試」為目標，這種應試取向的學習方式可能忽略了其他同樣重要的開發技能（如架構設計、團隊協作等）。

### **• 技術細節的時效性**

iOS 系統持續演進，文章中提到的某些實作細節（如 dyld、launchd 的具體行為）可能隨著 iOS 版本更新而改變，需要持續追蹤官方文件。

### **• 缺乏效能優化的具體建議**

雖然提到「依賴項越多，啟動時間越長」，但沒有深入探討如何實際優化應用程式啟動速度的具體策略。[\[21\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A611.505%2C%22top%22%3A4579.2%2C%22width%22%3A662.9400000000002%2C%22height%22%3A72%7D)

### **• SwiftUI 與 UIKit 的比較不夠深入**

文章提到 SwiftUI 底層仍使用相同機制，但沒有詳細說明在實務上兩者啟動流程的具體差異或效能影響。[\[30\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d39b1fcb-01a1-4874-ad48-2234c9aa583b?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A8035.200000000001%2C%22width%22%3A662.94%2C%22height%22%3A43.19999999999982%7D)

## 6\. 值得思考的問題

1. **啟動效能優化的優先順序**：在現代應用程式開發中，我們應該在啟動速度優化上投入多少心力？相較於功能開發和用戶體驗改善，這個優先級應該如何排序？

2. **系統知識的學習深度**：對於不同資歷的 iOS 開發者（初級、中級、資深），理解系統底層運作到什麼程度才算「足夠」？是否所有開發者都需要掌握這些細節？

3. **跨平台開發的影響**：隨著 Flutter、React Native 等跨平台框架的普及，深入理解原生 iOS 啟動流程的價值是增加還是減少？這對職涯發展有何影響？

4. **面試問題的設計哲學**：這類「系統原理」問題是否真的能有效評估開發者的實際工作能力？還是應該更重視實際問題解決能力和專案經驗？

5. **技術債務與架構演進**：從 AppDelegate 到 SceneDelegate 的架構變化，反映了什麼樣的設計思維轉變？這對我們設計自己的應用程式架構有何啟發？