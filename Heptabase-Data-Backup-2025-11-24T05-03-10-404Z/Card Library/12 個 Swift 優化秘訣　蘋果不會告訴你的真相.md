# 12 個 Swift 優化秘訣　蘋果不會告訴你的真相

[12 個 Swift 優化秘訣　蘋果不會告訴你的真相 ! 行動應用程式開發者 ! Stackademic --- 12 Swift Optimization Secrets Apple Won.pdf](../Card%20Library/12%20個%20Swift%20優化秘訣　蘋果不會告訴你的真相%20!%20行動應用程式開發者%20!%20Stackademic%20---%2012%20Swift%20Optimization%20Secrets%20Apple%20Won.pdf)

![Pasted 2025-11-23-15-32-34.png](./12%20個%20Swift%20優化秘訣　蘋果不會告訴你的真相-assets/Pasted%202025-11-23-15-32-34.png)

### 1\. 文章核心主題與目標

- **核心主題**：本文探討了 Swift 語言中鮮為人知或常被忽視的效能優化技巧，重點在於透過理解記憶體管理（ARC、COW）、編譯器行為（Dispatch、WMO）以及資料處理策略，來提升應用程式的執行速度並降低資源消耗。

- **目標讀者**：**中階至資深開發者**。讀者需要具備基本的 Swift 開發經驗，並對記憶體運作（Stack vs Heap）有初步概念，才能理解為何這些優化手段有效。

參考：Invalid section

### 2\. 涉及的技術概念清單

以下為文章提及或隱含的關鍵技術：

- **記憶體管理**： 參考：[ARC底層原理.md](./ARC底層原理.md)

   - **ARC (Automatic Reference Counting)**：自動參考計數的效能開銷。

   - **Copy-On-Write (COW)**：寫入時複製機制，特別是針對集合類型（Array, Dictionary）。

   - **Stack vs. Heap**：堆疊與堆積記憶體的分配差異。

   - **Memory Alignment**：結構體（Struct）屬性的記憶體對齊與填充（Padding）。

- **編譯器與執行期特性**：

   - **Method Dispatch**：靜態分派（Static Dispatch）與動態分派（Dynamic Dispatch）。

   - **Inlining**：函式內聯（行內展開）。

   - **WMO (Whole Module Optimization)**：全模組優化。

- **Swift 語言特性**：

   - **Value Types (Struct/Enum) vs. Reference Types (Class)**。

   - **Keywords**：`final`、`private`、`inout`、`unowned`。

   - **Concurrency**：Actors、Data Races（資料競爭）。

- **框架與工具**：

   - **Instruments**：Time Profiler（時間分析器）、Allocations（記憶體分配）。

   - **Core Data**：資料庫索引優化。

   - **SwiftUI**：渲染循環（Render Loop）、視圖更新機制。

   - **Foundation**：`JSONDecoder`、`InputStream`。

### 3\. 主要內容架構

文章按邏輯分為以下幾個技術區塊：

1. **集合與記憶體優化**：

   - 介紹 Swift 集合類型的 COW 機制。

   - 建議使用 `inout` 或預留容量（`reserveCapacity`）來減少複製與重分配。

2. **型別選擇與 ARC 開銷**：

   - 比較 Struct 與 Class，強調 Struct 在 Stack 上分配的優勢。

   - 探討 ARC 的 retain/release 成本，建議在無循環引用風險下使用 `unowned` 減少計數操作。

3. **函式調度與編譯器優化**：

   - 解釋動態分派（V-Table）的成本。

   - 如何透過 `final`、`private` 關鍵字促使編譯器進行靜態分派與內聯。

   - 啟用 Whole Module Optimization (WMO)。

4. **進階記憶體佈局**：

   - 調整 Struct 內部屬性宣告順序，減少記憶體填充（Padding）造成的空間浪費。

5. **並發與安全性**：

   - 使用 Actors 進行狀態隔離，避免資料競爭。

6. **I/O 與資料處理**：

   - JSON 解析優化（使用串流 Stream 而非一次載入）。

   - Core Data 查詢索引優化。

7. **UI 渲染效能**：

   - SwiftUI 視圖拆分與減少不必要的重繪。

8. **檢測工具**：

   - 使用 Instruments 尋找效能瓶頸。

### 4\. 核心技術觀點整理

- **善用 Copy-On-Write (COW)**：

   - *概念*：Swift 的集合在賦值時僅複製指標，直到內容被修改（寫入）時才真正複製資料。

   - *重點*：在傳遞大型陣列時，若無意修改，無需擔心效能；但若需頻繁修改，應使用 `inout` 參數直接操作原始記憶體，避免觸發複製。[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A389.48%2C%22top%22%3A1195.2%2C%22width%22%3A692.076%2C%22height%22%3A86.39999999999986%7D)[\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A402.96200000000005%2C%22top%22%3A1958.4%2C%22width%22%3A653.1279999999999%2C%22height%22%3A71.99999999999977%7D)

- **優先選擇 Struct (Value Types)**：

   - *概念*：Struct 分配在 Stack 上，創建與銷毀速度極快且無 ARC 開銷。

   - *重點*：除非需要繼承或共享狀態，否則應避免使用 Class。Class 存於 Heap，需鎖定機制維護參考計數，成本較高。[\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A402.96200000000005%2C%22top%22%3A2332.8%2C%22width%22%3A681.5899999999999%2C%22height%22%3A86.40000000000009%7D)[\[4\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A398.468%2C%22top%22%3A2462.4%2C%22width%22%3A596.204%2C%22height%22%3A57.59999999999991%7D)

- **減少動態分派 (Dynamic Dispatch)**：

   - *概念*：Swift 的 Class 預設使用 V-Table 進行方法查找，比直接呼叫慢。

   - *最佳實踐*：將類別宣告為 `final` 或方法宣告為 `private`，編譯器能確定該方法不會被覆寫，從而優化為直接呼叫（Devirtualization）甚至內聯（Inlining）。[\[5\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A393.974%2C%22top%22%3A4867.200000000001%2C%22width%22%3A674.0999999999999%2C%22height%22%3A72%7D)[\[6\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A405.958%2C%22top%22%3A5385.6%2C%22width%22%3A498.8339999999999%2C%22height%22%3A72%7D)

- **記憶體對齊優化 (Memory Layout)**：

   - *概念*：CPU 存取記憶體有對齊要求。Struct 屬性順序不同可能導致總大小不同。

   - *最佳實踐*：按屬性佔用空間大小（大到小）排列，可減少記憶體間隙（Padding），降低記憶體佔用。[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A398.468%2C%22top%22%3A6768%2C%22width%22%3A539.28%2C%22height%22%3A57.599999999999454%7D)

- **JSON 串流解析**：

   - *概念*：一次性將大檔案載入 RAM 進行 JSON 解析會導致記憶體峰值。

   - *最佳實踐*：對於大型數據，改用 `InputStream` 進行增量解析。[\[8\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A398.468%2C%22top%22%3A10454.4%2C%22width%22%3A435.91800000000006%2C%22height%22%3A57.600000000000364%7D)[\[9\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A410.45200000000006%2C%22top%22%3A10598.4%2C%22width%22%3A678.594%2C%22height%22%3A72%7D)

### 5\. 技術原理深度分析

- **ARC 的隱形成本**： 文章深入指出了 ARC 並非「免費」。每次參考引用類型變數（Reference Type），系統都必須執行原子級（Atomic）的增減操作以確保執行緒安全。在高頻迴圈中，這些微小的操作會累積成顯著的 CPU 負擔。文章提出的 `unowned` 技巧是透過繞過引用計數檢查來提升效能，但這需要開發者對物件生命週期有絕對把握。

- **編譯器去虛擬化 (Devirtualization)**： 文章透過建議使用 `final` 和 `private`，觸及了編譯器優化的核心機制。Swift 編譯器若能證明一個方法呼叫的目標在編譯期是唯一的，它就能移除查表（V-Table lookup）過程，轉為直接記憶體位址跳轉，這是 C++ 等語言常見的優化手段。

- **記憶體佈局與 CPU Cache**： 關於 Struct 屬性重排的建議，背後原理是 CPU 的記憶體對齊（Alignment）。例如，一個 `Bool` (1 byte) 後接 `Int` (8 bytes)，為了對齊，編譯器會在 `Bool` 後填充 7 bytes。重新排列屬性可以壓縮結構體大小，這不僅節省 RAM，更能提高 CPU Cache 的命中率（因為更多資料能塞進同一 Cache Line）。

### 6\. 實務應用要點

- **程式碼層面**：

   - 定義 Model 時，優先使用 `struct`。

   - 在 Class 定義前加上 `final`，除非明確知道它會被繼承。

   - 處理大型 Array 修改時，將函式參數標記為 `inout`。

- **架構層面**：

   - 在 SwiftUI 中，將龐大的 `body` 拆分成多個小的子 View（Subviews），這有助於 SwiftUI 識別變更範圍，只重繪變更的部分。[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A410.45200000000006%2C%22top%22%3A11318.4%2C%22width%22%3A612.682%2C%22height%22%3A100.80000000000109%7D)

   - 對於 Core Data，針對查詢條件（Predicates）中常用的欄位建立索引（Indexing）。[\[11\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A402.96200000000005%2C%22top%22%3A10900.8%2C%22width%22%3A361.018%2C%22height%22%3A72%7D)

- **除錯與驗證**：

   - **不要猜測效能瓶頸**。必須使用 Xcode 的 **Instruments (Time Profiler)** 找出真正的熱點（Hotspots）。[\[12\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A398.468%2C%22top%22%3A9648%2C%22width%22%3A419.44%2C%22height%22%3A57.600000000000364%7D)

### 7\. 技術限制與注意事項

- **`unowned` 的風險**： 文章建議使用 `unowned` 來減少 ARC 開銷 [\[13\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A402.96200000000005%2C%22top%22%3A4132.799999999999%2C%22width%22%3A483.85399999999987%2C%22height%22%3A72.00000000000091%7D)，但這是一個危險的操作。若被引用的物件已釋放，存取 `unowned` 變數會導致立即崩潰（Crash）。僅在確定參考對象生命週期長於持有者時使用。

   - [無主引用 (Unowned Reference).md](./無主引用%20\(Unowned%20Reference\).md)

- **過度優化的陷阱**： 手動調整 Struct 屬性順序雖然省記憶體，但會降低程式碼可讀性（相關屬性被拆散）。應僅在大量實例化該 Struct 的場景下才進行此類優化。

- **`final` 並非萬靈丹**： 評論中提到 [\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=2&pdfBoundingBox=%7B%22left%22%3A405.958%2C%22top%22%3A558.596%2C%22width%22%3A671.1039999999998%2C%22height%22%3A49.738000000000056%7D)，`final` 雖能開啟靜態分派，但如果涉及 Protocol Existentials（存在類型，如 `var x: SomeProtocol`），即使實作類別是 `final`，透過 Protocol 呼叫仍可能產生動態開銷（Witness Table lookup）。

- **標題黨嫌疑**： 上下文評論指出 [\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/1d1718e6-a401-443a-b78d-efe7679ddfdc?pdfPage=2&pdfBoundingBox=%7B%22left%22%3A405.958%2C%22top%22%3A145.388%2C%22width%22%3A677.0959999999998%2C%22height%22%3A42.08600000000001%7D)，這些其實是 Apple 在 WWDC 和文件中多次提及的標準知識，並非真正的「秘密」。

### 8\. 延伸技術議題

基於文章內容，以下是可以進一步深入研究的主題：

1. **Swift 6 的並發模型 (Strict Concurrency)**：文章簡單提到了 Actors，但未深入探討 `Sendable` 協議、Task 的繼承上下文以及 Swift 6 中更嚴格的編譯器檢查。

2. **Protocol Witness Table (PWT)**：除了 Class 的 V-Table，了解 Protocol 的 PWT 對於理解 Swift 泛型與協議導向程式設計（POP）的效能影響至關重要。

3. **Existential Containers**：當使用 Protocol 作為型別時，Swift 如何在記憶體中包裝不同大小的實作類型（使用 Existential Container），這對效能有何影響？

4. **SIMD (Single Instruction, Multiple Data)**：對於極致的數學運算優化，Swift 提供了 SIMD 支援，這比單純依賴編譯器的自動向量化更可控。

5. **Off-Main-Thread Rendering**：雖然文章提到 SwiftUI，但深入了解 Core Animation 的渲染伺服器機制以及如何避免主執行緒阻塞（Main Thread Hangs）是 iOS 效能優化的永恆話題。