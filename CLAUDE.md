# CLAUDE.md

本檔案為 Claude Code (claude.ai/code) 在此專案中工作時的指引文件。

## 專案概述

這是一個 **iOS 銀行／理財應用程式**（SKBankX）的元件庫，包含以 Swift 撰寫的可重用 UIView 元件。此 Repo 存放從完整 SKBankX 專案中抽取的 UI 元件，聚焦於以 Reactive 模式驅動的 TableView 類型視圖，用於市場資料展示與基金操作功能。

## 技術棧與依賴

- **語言：** Swift（iOS、UIKit）
- **響應式框架：** RxSwift、RxCocoa、RxDataSources、RxGesture
- **佈局：** Stevia（程式化 Auto Layout DSL）
- **主題系統：** 自訂 `Theme.shard.current` 機制，支援深色／淺色模式
- **在地化：** 使用 `.localized` 字串擴充模式

此 Repo 未追蹤 Xcode 專案檔、Package.swift 或 Podfile，Swift 檔案為從較大的 SKBankX iOS 專案中抽取的元件。

## 架構

**模式：** MVVM + Reactive 綁定（RxSwift）

每個視圖元件遵循一致的結構：
1. **PublishRelay 屬性** — 公開的輸入（資料）與輸出（點擊事件）
2. **DisposeBag** — 與生命週期綁定的 Rx 訂閱管理
3. **`setupView()`** → `setupLayout()` → `applyTheme()` — 初始化鏈
4. **`bindView()`** — 串接 Rx 資料源、Cell 選取事件、以及 contentSize 監聽實現動態高度
5. **Lazy UI 屬性** — 所有子視圖皆為 `lazy var`，於閉包內行內配置
6. **Stevia 佈局** — 使用 `self.subviews(...)` 與 `self.layout(...)` DSL 取代 NSLayoutConstraints

**主要元件：**
- `SKMarketView` — 分區式 TableView，展示市場資料（`SKMarketSection` / `SKMarketCell`）
- `SKFundOperationView` — 基金操作列表，附帶操作按鈕（`SKFundOperationSection` / `SKFundOperationCell`）

## 編碼規範

定義於 `GEMINI.md`，Swift 相關重點：

- **架構：** MVVM-C（Model-View-ViewModel-Coordinator）
- **並行處理：** 新程式碼優先使用 Swift Concurrency（`async`/`await`），而非 Closures 或 GCD
- **Optional 處理：** 禁止強制解包（`!`），使用 `guard let` 或 `if let` 安全解包
- **命名：** 遵循 Swift API Design Guidelines；Protocol 以能力描述命名
- **註解：** 解釋「為什麼」，而非「做了什麼」
- **提交訊息：** 遵循 Conventional Commits 格式 — `<type>(<scope>): <description>`
- **錯誤處理：** 定義自訂錯誤型別；不可靜默吞掉錯誤

## 已知問題

記載於 `code_review_result.md`：
- `SKFundOperationView`：`btnList` 與 `ivBack` 已宣告但未在 `setupView()` 中加入視圖層級
- `applyTheme()` 在 `layoutSubviews()` 中被呼叫，導致每次佈局更新都會重複執行（兩個視圖皆有此效能隱患）
