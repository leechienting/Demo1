# 7 個沒人討論的 Swift 秘技

[7 個沒人討論的 Swift 秘技！ ! 作者：Jayant Kumar ! 2025 年 10 月 ! Medium --- 7 Swift Secrets Nobody Talks Abo.pdf](../Card%20Library/7%20個沒人討論的%20Swift%20秘技！%20!%20作者：Jayant%20Kumar%20!%202025%20年%2010%20月%20!%20Medium%20---%207%20Swift%20Secrets%20Nobody%20Talks%20Abo.pdf)

- \*\*1. `@inline(__always)`\*\*：

   - **重點**：介紹 `inline(__always)` 屬性，它指示 Swift 編譯器直接複製函式程式碼（函式內聯），而非透過呼叫來執行，以提升效能 [\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/7d434e8b-8682-4a77-90e3-c081ac5e4000?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A2059.2%2C%22width%22%3A348.615%2C%22height%22%3A72%7D)。

   - **注意事項**：警告不應隨處使用，因為可能增加二進位檔大小、延長編譯時間，甚至在程式碼龐大或優化未提升效能時反而變慢 \[\[ref:13\], \[ref:16\], \[ref:19\]\]。建議用於小型、在迴圈和數學計算中頻繁呼叫的函式 [\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/7d434e8b-8682-4a77-90e3-c081ac5e4000?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A615.315%2C%22top%22%3A3139.2%2C%22width%22%3A297.17999999999995%2C%22height%22%3A72.00000000000045%7D)。

- \*\*2. `@_transparent`\*\*：

   - **重點**：說明 `@_transparent` 是 `@inline(__always)` 的進階版本。與前者不同，它強制編譯器優化函式內部及其餘程式碼，並在編譯器決定是否優化時不考慮其判斷 \[\[ref:18\], \[ref:21\]\]。

   - **範例**：展示了如何使用 `@_transparent` 優化類似 `2 * (y + 1)` 的表達式為 `(2 * y) + 2`