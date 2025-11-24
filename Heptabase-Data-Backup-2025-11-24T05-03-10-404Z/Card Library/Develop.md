Develop



```plain
1761 重複序號裝置-結果頁errorMsg處理 - Chienting
1762 日曆追加「半年前」- Chienting
1723 行銀App-強提醒增加失聯戶提醒 - Chienting
1603 深色模式色票調整成新版色碼 - Chienting

上面做好可接著做 0109 Planning 👇
1596 [文字修正]「紀錄」改成「記錄」 - Chienting
1597 [文字修正]「自動扣繳」相關文字統一	 - Chienting
```

## ✅ 1597 \[文字修正\]「自動扣繳」相關文字統一

Figma

++<https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/(Public)-SKB-App-Mockup-%26-Prototype?node-id=90498-566760&t=V2xgdPOfMcyB8wLX-4>++

起因：原本嘉元取名太隨意，出現了以下

1. 卡費自動扣繳

2. 自動扣繳設定

3. 設定自動扣繳

4. 自動扣繳(還是需要，用在極短按鈕)

5. 自動扣繳變更(這個比較沒爭議，留著)

6. 取消自動扣繳(這個比較沒爭議，留著)

改成⮕自動扣繳設定（Auto Pay Setting）

詳見設計稿，換成對應的key值即可

## ✅ 1596 \[文字修正\]「紀錄」改成「記錄」

「紀錄」改成「記錄」

只有「創世紀」「紀元」才用糸部的(時間)，言部的是用在「記載」東西上\
但隱私權條款的錯字不動，因為我不敢改條款

翻譯表的字串，我也有更新了\
\
範圍：

1. 帳單繳費記錄，的小灰字(++[連結](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=61655-726798&t=9Ln1ofO94ZW8agPY-4)++)

   - credit_card_payment_history_note_1

   - SKPaymentHistoryViewController.Notice1

2. 轉帳記錄

   1. 標題(++[連結](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=59961-328496&t=yTFpgV73HGZG9ai6-4)++)

      - toolbar_title_edit_transfer_history

      - Assets.SKEditCommonTransferRecord.title

   2. popup，安卓字對 iOS要改 (++[連結](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=91497-601366&t=yTFpgV73HGZG9ai6-4)++)

      - Assets.SKEditCommonTransferRecord.DeleteCountMessage

3. 轉帳，小豬說話(++[連結](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=63132-291032&t=WkKaywMrx479P1Hn-4)++)

   - twd_transfer_step1_no_transfer_record

   - TWDAccount.SKTWDTransferMoney.SelectAccount.lblCommonEmpty

## ✅ 1603 深色模式色票調整成新版色碼

正式將深色模式改成如設計稿一樣的色碼

是為了顯示正確，因為現在有些新舊色票混合 搭配起來其實看不到按了按鈕，

如深色版的重置帳密，看不出來選項按了「是or否」\
\
因此決定直接對很舊的色票裡的色碼調包(看起來像新的)\
就不用等到每頁都翻新後，才換成新色碼\
\
需做以下四件事：

- 直接搜尋「#舊色碼」強行改成「#新色碼」\
   舊色碼(blue0\~3，依序調包成1\~4樓的色碼)：

1. \#0F1B26 ⮕ #151927 (模擬成1st)

2. \#192D40 ⮕ #21283A (模擬成2nd)

3. \#244566 ⮕ #2E364B (模擬成3rd)

4. \#395C80 ⮕ #4C5474 (模擬成4th)

5. \#12202E ⮕ #171C2B (模擬成viewonly)

6. iOS版：#0F1B26, 30% ⮕ #171C2B (模擬成viewonly)\
   安卓版：#4D0F1B26 ⮕ #171C2B (模擬成viewonly)

7. iOS版：0F1B26, 60% ⮕ #000306, 40% (模擬成dig)\
   安卓版：#990F1B26 ⮕ #66000306 (模擬成dig) 

- 新色票的「色碼」也要檢查是否為新

1. Background/Dark/1st  ⮕ #151927 

2. Background/Dark/2nd ⮕ #21283A 

3. Background/Dark/3rd ⮕ #2E364B

4. Background/Dark/4th ⮕ #4C5474

5. Background/Dark/Viewonly ⮕ #171C2B\
   設計師如何檢查：信用卡 開卡 (登入後)

6. Secondary/Dark/OnSurface ⮕ #DAD6FF\
   設計師如何檢查：信用卡 繳費按鈕 (要繳錢、沒自動扣繳狀態)

7. Blur/Dark\
   iOS版 ⮕151927, 75%\
   安卓版 ⮕ #BF151927

- 如果你更改好了，請告知嘉元一聲，設計師會親自跑去工程那邊看一下，肉搜色票類似「gary7_blue0」等名字，檢驗blue0.1.2.3系列 有被改色成「#新色碼」 

- 連帶用到背景色的圖片/元件更新or檢查：

1. ++[登入前的板子](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=79610-569770&t=0On7BPsgokL0UVrC-4)++，改用Background/3rd、4th 色票

   1. 安卓當時是下載板子圖片去做，需重載(++[連結](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=50371-69020&t=7p5iHoeG54HvE3Ch-4)++)

   2. iOS是++[灌錯色票](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=79610-569770&t=yUtEfwqBR7F8SlHG-4)++(不是1.2樓，板子和按鈕底色應分別為3、4樓)

## ✅ 1723 行銀App - 強提醒增加失聯戶提醒 

行銀App - 強提醒增加失聯戶提醒 

1: 強提醒API增加此項目

2: 點擊項目後 , 前端App紀錄30天內不再呈現 (中台API還會出現)

1. 登入敲帳密頁，++[頂端的切身分tab](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=50290-154316&t=uGXLs2uskodHd18c-4)++

   1. 安卓也是用下載圖片的作法，不應用載圖，會無法變英文

2. 申請外幣定存，「++[選擇帳戶及金額-區塊的底色](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=53367-424389&t=9FVybxSXJqxMwStj-4)++」\
   改成普通的2nd，外框框線拿掉(深淺色模式都是)

3. 圖片-信用卡的帳單/未出帳的「++[回到頂端](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=56987-193581&t=7p5iHoeG54HvE3Ch-4)++」按鈕

4. 圖片-iOS的小鈴鐺通知圖示，他們是直接下載有包含背景底色的圖，++[重新下載](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=40029-426742&t=uGXLs2uskodHd18c-4)++

5. ++[小鈴鐺的紅點，紅點外面那圈白圈](https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/%28Public%29-SKB-App-Mockup-%26-Prototype?node-id=91555-142338&t=uGXLs2uskodHd18c-4)++，\
   要根據深色模式變黑，所以白圈其實要套(background/1st)才對，\
   因為那個其實是要偽裝成切割線

6. 元件Toggle開關 (++[點我看畫面](https://www.figma.com/design/t7TD6UThB2JM3GfETbyNxU/QC%E9%A0%98%E5%9F%9F-%E8%A1%8C%E9%8A%80?node-id=8443-71857&t=Kv15Z7ODA9JzcV9w-4)++)

   1. 未開啟膠囊底色 改成Label/Aimai

   2. 開啟膠囊底色 改成Primary/Main

   3. 安卓的膠囊太長，能短一點嗎？50寬就好

   4. 檢查範圍：推播通知設定、mega深色

7. 安卓popup選項(++[點我看說明](https://www.figma.com/design/t7TD6UThB2JM3GfETbyNxU/QC%E9%A0%98%E5%9F%9F-%E8%A1%8C%E9%8A%80?node-id=8438-20913&t=3kLxVh1juUtl7V8T-4)++)

   1. 因為他跟一般頁最底層按鈕排「共用」，所以目前顏色都是2nd，但popup的時候，按鈕無法看起來是凸的 (凸的比較像凸起按鈕可以點)

   2. 我想替安卓特別追加一個色票，用在popup/一般流程頁底部按鈕元件上

      1. Background/Alter

      2. 淺色(保持純白)：#FFFFFF

      3. 深色(帶有透明)：#268CAAE6 or（#8CAAE6, 15%）

\
\
\
測試範圍：有舊有新\
現為舊的色票代表\
主首頁\
轉帳\
定存存單\
新色票代表\
換匯\
無卡提款\
megamenu\
重置帳密（著重看選\[是,否\]的那區塊）\
開卡(登入後)



## ✅  1762 台/外交易明細-時間快捷鍵 追加「半年前」、移除「7天」

解決日曆選太久遠的日期+跨距太長，操作很累

討論後，一致覺得7天太短，很容易沒東西，所以砍了7天

改成可以回查 6-12個月前的 半年前

figma

++<https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/(Public)-SKB-App-Mockup-%26-Prototype?node-id=94123-295289&t=FWKWStgU4wtDRk0k-4>++

- \[7天\]砍掉，改放成\[半年前\]

- 半年前指的是：6-12個月前(最早的半年)

- \[半年\]字眼->\[近半年\]

## ✅  1761 重複序號裝置綁定-結果頁面文案調整

figma

<https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/(Public)-SKB-App-Mockup-%26-Prototype?node-id=97256-608104&t=y2zxq61y7dL4a72l-4>

新增一個結果(失敗)頁面文案調整，因重複序號，要請用戶重新安裝

不確定內文是中台來的，還是需要靠前端寫

如果要靠前端寫，請再通知嘉元(我去列key跟英文)

裝置綁定-結果(失敗)頁面文案會因此有：

- 泛用失敗(現在已經有了)

- 重複序號失敗

## ✅ 1771 iOS 注意事項文字訂正 「美金」→「美元」

因為翻譯表找不到iOS的注意事項(應該是html)

所以要麻煩工程師改

申請外幣定存

- 每筆交易最低限額為等值美金 1,000元。

- ⬇️

- 每筆交易最低限額為等值美元 1,000元。

\
專屬換匯

- 個人戶申請人民幣以外的外幣互相轉帳，單日限額最高不得超過美金9萬元; 公司戶申請人民幣以外的外幣互相轉帳，單筆交易的金額上限為等值美元10萬元，每日營業日交易累計上限不得大於美元100萬元。(每日限額累計與外幣匯出匯款扣外幣帳號合併計算)

- ⬇️

- 個人戶申請人民幣以外的外幣互相轉帳，單日限額最高不得超過美元9萬元; 公司戶申請人民幣以外的外幣互相轉帳，單筆交易的金額上限為等值美元10萬元，每日營業日交易累計上限不得大於美元100萬元。(每日限額累計與外幣匯出匯款扣外幣帳號合併計算)

\
外幣換匯

- 個人戶申請人民幣以外的外幣互相轉帳，單日限額最高不得超過美金 9 萬元。(每日限額累計與外幣匯出匯款扣外幣帳號合併計算)

- ⬇️

- 個人戶申請人民幣以外的外幣互相轉帳，單日限額最高不得超過美元 9 萬元。(每日限額累計與外幣匯出匯款扣外幣帳號合併計算)

## ✅ 1774 iOS 零存整付 若輸入非百元之倍數(如：6666)，應要顯示對應錯誤訊息

截圖

++<https://www.figma.com/design/t7TD6UThB2JM3GfETbyNxU/QC%E9%A0%98%E5%9F%9F-%E8%A1%8C%E9%8A%80?node-id=8739-24457&t=CvsMqklZpjww06nz-4>++

如果我輸入非百元之倍數(如：6666)，應要顯示：

> 金額需至少為台幣1千元，且須為百元之倍數

\
iOS少了這個key，所以目前會錯誤顯示為：

> 金額需至少為台幣1千元

(但6666是超過1000元的，不應這樣呈現)

\
提供安卓key讓你去翻譯表找對應字，並記得補上iOS的key：\
fixed_deposit_twd_apply_step2_multiple_100

## ✅ 1901 請協助調整行銀APP匯率到價通知功能之可設定幣別：移除「墨西哥幣MXN」、「土耳其幣TRY」

匯率到價通知功能：移除「墨西哥幣MXN」、「土耳其幣TRY」

## ✅ 1858 iOS APP Icon提供換顏色功能(原生) 

設計稿就是超連結

iOS

因應iOS18可以調整 APP Icon的顏色

給出了相應的深色模式與 隨意顏色油漆桶tint模式

(但目前我們這裡Xcode版本不是最新，可能無法增加對嗎，那大該都幾月會更新)

2025/3/27起，已確認Xcode更新了

++<https://www.figma.com/design/3QXbP12XIwcESprXuxOaCf/(Public)-SKB-App-Mockup-%26-Prototype?node-id=77283-520894&t=nUVRrF9TENsgqPgg-4>++

蘋果官方：需要什麼樣格式的檔案

++<https://developer.apple.com/design/human-interface-guidelines/app-icons#Platform-considerations>++