# ARC底層原理

標題：\[ARC底層原理\] 

日期：2025/10/23

## 這是什麼？

ARC 是編譯時期的技術，透過自動插入 retain/release 程式碼來管理物件生命週期

## 為什麼重要？

- 解決手動管理記憶體的複雜性與風險。

- 不用ARC，必須手動管理記憶體，容易會有**記憶體洩漏 (Memory Leaks)、懸垂指標 (Dangling Pointers) 導致的閃退**的問題。

- ARC可以編譯器在編譯時期自動為你插入正確的記憶體管理程式碼。提升了開發效率，也顯著降低了因記憶體管理不當而導致的閃退和效能問題。

## 關鍵機制有那些？

- [強引用](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/d71cfbe0-0938-4575-903d-6ff0683b0a3f)、[弱引用](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/010eb7ae-cb76-4f54-ba5e-8a34b11489af)、[無主引用](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/3790ddb4-0cf0-4607-be45-ab9781ab3651)。

   - **`strong`** 是預設的，它會讓物件的生命延續。

   - **`weak`** 和 **`unowned`** 都是為了解決**強引用循環**而存在的，它們都不會增加引用計數。

   - 選擇 **`weak`** 還是 **`unowned`** 的關鍵在於：你引用的物件有沒有可能比你先被銷毀？

      - 如果可能，就用 `weak` (變數會變 `nil`)。

      - 如果你非常確定它不會先被銷毀，才用 `unowned` (效能稍高，但風險自負)。

## [如何運作？](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/f02181b0-f313-4933-925d-2aa44ce56637)

\[核心機制，可以畫圖\]

## 實際例子

**一個人 (Person) 和一間公寓 (Apartment)**

- 一個人可以擁有一間公寓。

- 一間公寓一定有一個房客。

## 工作中的連結

- **Delegate 模式**

- **閉包 (Closures)**

   ```javascript
   // ❌ 問題：self被closure強引用，closure被self持有 → 循環
   self.button.addAction { [self] in
       self.doSomething()  // 循環引用
   }
   
   // ✅ 解決：capture list用weak self
   self.button.addAction { [weak self] in
       self?.doSomething()  // 安全，self可能為nil
   }
   ```

- **父子物件關係**

- **Timer 持有 target（常見陷阱）**

## 提出延伸問題

- **哪些場景會明確地使用 `unowned` 而不是 `weak`？**

   - 選擇使用 `unowned` 而不是 `weak` 的關鍵在於你是否「非常確定」被引用的物件不會在你引用的物件之前被銷毀 [\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/de0cd134-62dd-4125-9b6e-3c7748b16335#3b03ef57-a114-4a7e-985e-1986687039f8,6eba1d72-5b00-4cec-805f-3d2b5eef3c67)。如果這個條件成立，你可以使用 `unowned`；反之，如果被引用的物件有可能先被銷毀，則應該使用 `weak` [\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/de0cd134-62dd-4125-9b6e-3c7748b16335#3b03ef57-a114-4a7e-985e-1986687039f8,6eba1d72-5b00-4cec-805f-3d2b5eef3c67)。

   - 一個父物件擁有子物件，而子物件需要引用回父物件時，如果父物件的存在時間必定比子物件長，子物件對父物件的引用就可以是 `unowned`。

   - 總之，`unowned` 比 `weak` 的效能會稍高一些，但風險也更高 [\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/de0cd134-62dd-4125-9b6e-3c7748b16335#3b03ef57-a114-4a7e-985e-1986687039f8,6eba1d72-5b00-4cec-805f-3d2b5eef3c67)。

- **Timer、NotificationCenter 觀察者等。如何確保它們被正確釋放？**

   - Timer必須明確地呼叫它的 `invalidate()` 方法。這會使 `Timer` 停止觸發，並釋放它對 `target` 的強引用。

   - Timer閉包中引用了 `self`，請務必使用 `[weak self]` 或 `[unowned self]` 來避免強引用循環。

   - NotificationCenter需要手動 `removeObserver()`。

- **即使有了 ARC，是否還可能發生記憶體洩漏？如果有，是哪些情況？**

   - 引用循環、Delegate、閉包、Timer 都有可能造成記憶體洩漏。

- **[既然 ARC 只針對類別實例，那麼結構 (struct) 和列舉 (enum) 等值型別的記憶體是如何管理的？](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/9dd5d222-9322-4d44-a5f2-acc4716aef76)**