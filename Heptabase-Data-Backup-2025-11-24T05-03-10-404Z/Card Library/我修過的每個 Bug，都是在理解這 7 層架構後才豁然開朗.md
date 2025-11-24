# 我修過的每個 Bug，都是在理解這 7 層架構後才豁然開朗

[我修過的每個 Bug，都是在理解這 7 層架構後才豁然開朗 ! 作者：延遲賭徒 ! 2025 年 10 月 ! Medium --- Every Bug I Ever Fixed Made S.pdf](../Card%20Library/我修過的每個%20Bug，都是在理解這%207%20層架構後才豁然開朗%20!%20作者：延遲賭徒%20!%202025%20年%2010%20月%20!%20Medium%20---%20Every%20Bug%20I%20Ever%20Fixed%20Made%20S.pdf)

![image.png](./我修過的每個%20Bug，都是在理解這%207%20層架構後才豁然開朗-assets/image.png)

#### **1\. 文章核心論點**

作者主張，軟體開發者不應將除錯（debugging）侷限於應用程式的程式碼層面。[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A2314.956%2C%22width%22%3A678.1800000000001%2C%22height%22%3A62.23000000000002%7D) 透過理解並應用OSI網路七層架構作為心智模型，開發者能更有系統地定位問題的根源，將除錯從「猜測」轉變為一門精準的「工程技術」，進而高效解決看似棘手的Bug。[\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A1306.83%2C%22width%22%3A672.465%2C%22height%22%3A62.23000000000002%7D)[\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A1418.844%2C%22width%22%3A664.845%2C%22height%22%3A74.67599999999993%7D)[\[4\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A7766.304%2C%22width%22%3A668.655%2C%22height%22%3A74.67600000000039%7D)

#### **2\. 主要內容架構**

1. **引言：一個慘痛的除錯經驗**

   - 作者分享自己曾花費兩週時間追查一個隨機出現的「502錯誤」。[\[5\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A435.61%2C%22width%22%3A735.3299999999999%2C%22height%22%3A124.45999999999992%7D) 儘管應用程式日誌和運作一切正常，問題卻看似毫無頭緒，最終才發現問題並非出在應用程式，而是在更底層的網路設定，意識到自己一直在錯誤的層級上除錯。[\[2\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A1306.83%2C%22width%22%3A672.465%2C%22height%22%3A62.23000000000002%7D)

2. **核心概念：OSI七層模型作為除錯框架**

   - 提出OSI模型不僅是為了考試，而是一個能有效避免在錯誤層級浪費時間的強大心智框架。[\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A1418.844%2C%22width%22%3A664.845%2C%22height%22%3A74.67599999999993%7D) 作者由上至下，逐層解析各層級可能發生的問題，並輔以實際案例說明。

3. **分層解析與案例說明**

   - **第七層 (應用層)**：這是開發者最熟悉的層級，處理HTTP請求、API等。但作者提醒，許多看似應用層的錯誤，根源其實在更低的層級。[\[6\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A624.84%2C%22top%22%3A2165.604%2C%22width%22%3A489.5849999999999%2C%22height%22%3A62.23000000000002%7D)[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A2314.956%2C%22width%22%3A678.1800000000001%2C%22height%22%3A62.23000000000002%7D)

   - **第四層 (傳輸層)**：關注TCP/UDP連線、連接埠和逾時問題。作者舉例，系統核心耗盡可用連接埠，會導致應用程式無法建立新連線，即使CPU和記憶體看似正常。[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A588.645%2C%22top%22%3A3198.6220000000003%2C%22width%22%3A590.55%2C%22height%22%3A74.67599999999993%7D)[\[8\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A3621.7859999999996%2C%22width%22%3A678.1800000000002%2C%22height%22%3A62.23000000000002%7D)

   - **第三層 (網路層)**：涉及IP路由、DNS解析等。作者以一個跨資料中心的路由器設定錯誤為例，此錯誤導致封包遺失，但應用程式誤判為資料庫問題而錯誤地重試，加劇了狀況。[\[9\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A4592.574%2C%22width%22%3A662.9399999999999%2C%22height%22%3A74.67600000000039%7D)[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A5214.874%2C%22width%22%3A651.51%2C%22height%22%3A62.23000000000047%7D)

   - **第二層 (資料連結層)**：處理MAC位址、交換器等。作者提到雲端環境中的網路介面卡限制，例如EC2執行個體類型對每秒封包數的限制，可能成為效能瓶頸。[\[11\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A5351.78%2C%22width%22%3A664.8450000000001%2C%22height%22%3A62.23000000000047%7D)[\[12\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A5438.902%2C%22width%22%3A664.8450000000001%2C%22height%22%3A62.22999999999956%7D)

4. **實踐與心態轉變**

   - 作者倡導一種「分層分析」的除錯流程，取代盲目猜測。[\[13\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A613.41%2C%22top%22%3A5575.808%2C%22width%22%3A283.845%2C%22height%22%3A74.67600000000039%7D) 他舉負載平衡器的常見問題為例，將「連線被拒」對應到第四層、「502錯誤」對應到第七層，展現如何應用此框架。[\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6857.746000000001%2C%22width%22%3A419.1%2C%22height%22%3A62.22999999999956%7D)[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6932.4220000000005%2C%22width%22%3A403.86%2C%22height%22%3A49.78400000000056%7D)

   - 他分享了個人心態的轉變：從問「網路掛了？」，轉變為問「哪一層掛了？」。[\[16\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A584.835%2C%22top%22%3A7094.219999999999%2C%22width%22%3A662.94%2C%22height%22%3A74.67600000000039%7D)

5. **結論：從考古到工程**

   - 最後，作者用最初的「502錯誤」案例收尾，解釋其根本原因是負載平衡器（第七層）的連線逾時設定比應用程式（第四層）短，導致請求被送到一個已失效的連線上。[\[17\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A613.41%2C%22top%22%3A7243.571999999999%2C%22width%22%3A676.2750000000002%2C%22height%22%3A87.1220000000003%7D) 他總結道，理解七層架構的精髓在於能以系統化的視角看待問題，讓除錯成為一門真正的工程技術。[\[18\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A613.41%2C%22top%22%3A7654.29%2C%22width%22%3A661.0350000000002%2C%22height%22%3A62.22999999999956%7D)[\[4\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A7766.304%2C%22width%22%3A668.655%2C%22height%22%3A74.67600000000039%7D)

#### **3\. 關鍵觀點整理**

- **多數「應用程式錯誤」並非源於應用程式本身**

   - **例子**：一個API上傳功能故障，API本身回應`200 OK`，但實際上檔案上傳失敗。追查後發現，是因為檔案過大，在到達應用程式之前就被Nginx伺服器拒絕了。那個`200 OK`的回應其實來自另一個不相關的成功請求。[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A2314.956%2C%22width%22%3A678.1800000000001%2C%22height%22%3A62.23000000000002%7D)[\[19\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A598.17%2C%22top%22%3A2899.918%2C%22width%22%3A680.0850000000002%2C%22height%22%3A62.22999999999956%7D)

- **底層資源限制會偽裝成高層應用問題**

   - **例子**：一個看似正常的應用程式突然無法對外建立網路連線。檢查CPU和記憶體都沒問題，但透過`netstat`指令發現，作業系統核心因為有數千個處於`TIME_WAIT`狀態的連線，耗盡了可用的TCP連接埠，導致新連線失敗。[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A588.645%2C%22top%22%3A3198.6220000000003%2C%22width%22%3A590.55%2C%22height%22%3A74.67599999999993%7D)[\[8\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A628.65%2C%22top%22%3A3621.7859999999996%2C%22width%22%3A678.1800000000002%2C%22height%22%3A62.23000000000002%7D)

- **錯誤的層級歸因會導致錯誤的解決方案**

   - **例子**：修復資料庫連線問題時，應用程式和資料庫本身都運作正常。問題最終定位於兩個資料中心之間的路由器設定錯誤，導致封包遺失。應用程式誤以為是資料庫問題而不斷重試，反而使網路狀況惡化。[\[20\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A621.03%2C%22top%22%3A4928.616%2C%22width%22%3A643.8900000000001%2C%22height%22%3A49.78400000000056%7D)[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A5214.874%2C%22width%22%3A651.51%2C%22height%22%3A62.23000000000047%7D)

- **除錯應是系統化的分層分析，而非隨機猜測**

   - **例子**：面對負載平衡器的問題，作者展示了如何系統性地歸因：

      - 連線被拒絕 -> 檢查第四層 (TCP/UDP)，可能是連接埠或防火牆問題。[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6932.4220000000005%2C%22width%22%3A403.86%2C%22height%22%3A49.78400000000056%7D)

      - 502 Gateway Timeout -> 檢查第七層 (應用層)，可能是後端服務超時。[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6932.4220000000005%2C%22width%22%3A403.86%2C%22height%22%3A49.78400000000056%7D)

      - 連線中斷 -> 檢查第二層 (資料連結層)，可能是網路中防火牆的問題。[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6932.4220000000005%2C%22width%22%3A403.86%2C%22height%22%3A49.78400000000056%7D)

#### **4\. 作者的論證邏輯**

作者採用了「**案例驅動的歸納法**」來支持其核心論點。

1. **提出問題**：以一個自己親身經歷、極具挑戰性的「502錯誤」作為引子，引發讀者的共鳴與好奇心。[\[5\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A435.61%2C%22width%22%3A735.3299999999999%2C%22height%22%3A124.45999999999992%7D)

2. **引入框架**：提出OSI七層模型是解決這類問題的關鍵心智框架。[\[3\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A1418.844%2C%22width%22%3A664.845%2C%22height%22%3A74.67599999999993%7D)

3. **逐層舉證**：從上到下（第七層到第二層），為每一層都提供一個具體的、開發者可能遇到的Bug作為例證。這些例子涵蓋了從設定錯誤、資源耗盡到硬體限制等多種類型。[\[1\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A603.885%2C%22top%22%3A2314.956%2C%22width%22%3A678.1800000000001%2C%22height%22%3A62.23000000000002%7D)[\[7\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A588.645%2C%22top%22%3A3198.6220000000003%2C%22width%22%3A590.55%2C%22height%22%3A74.67599999999993%7D)[\[10\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A617.22%2C%22top%22%3A5214.874%2C%22width%22%3A651.51%2C%22height%22%3A62.23000000000047%7D)[\[12\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A609.6%2C%22top%22%3A5438.902%2C%22width%22%3A664.8450000000001%2C%22height%22%3A62.22999999999956%7D)

4. **展示應用**：透過負載平衡器的例子，將理論框架與日常除錯情境結合，展示如何實際應用這套方法論。[\[14\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6857.746000000001%2C%22width%22%3A419.1%2C%22height%22%3A62.22999999999956%7D)[\[15\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A607.695%2C%22top%22%3A6932.4220000000005%2C%22width%22%3A403.86%2C%22height%22%3A49.78400000000056%7D)

5. **解決懸念並總結**：最後回到開頭的「502錯誤」案例，用七層架構的視角完美解釋了問題的根本原因，形成首尾呼應，強化了論點的說服力。[\[17\]](https://app.heptabase.com/f3c4fc0d-fe07-4b10-932c-6f968c1f5ab0/card/bee52243-d2eb-4460-bc9d-814f6e39a974?pdfPage=1&pdfBoundingBox=%7B%22left%22%3A613.41%2C%22top%22%3A7243.571999999999%2C%22width%22%3A676.2750000000002%2C%22height%22%3A87.1220000000003%7D)

整個論證過程清晰、有條理，透過具體的實例讓抽象的網路模型變得平易近人且實用。

#### **5\. 可能的爭議或限制**

- **模型的簡化**：OSI七層模型是一個理論模型，現代網路普遍採用的是更簡化的TCP/IP四層模型。雖然OSI在概念劃分上更清晰，有助於教學和除錯，但在實際的網路協定中，各層之間的界線並非總是如此分明。

- **案例的普適性**：文章中的案例主要集中在網路服務和後端開發，對於前端開發、桌面應用或嵌入式系統的開發者來說，雖然底層原理相通，但這些具體案例的直接參考價值可能較低。

- **工具的缺乏**：文章強調了思維模型的重要性，但沒有深入探討在每個層級進行問題診斷所需的具體工具（如 `tcpdump`, `wireshark`, `netstat`, `traceroute` 等），新手讀者可能仍不知如何下手。

- **現代架構的複雜性**：在微服務、容器化（Docker）、服務網格（Service Mesh）等現代雲端原生架構中，網路抽象層級更多，問題可能跨越多個抽象層，使得僅用傳統OSI模型分析變得更具挑戰性。

---

### **值得思考的問題**

1. 在您自己的開發經驗中，是否曾遇到過一個讓你困惑已久的Bug，而其根本原因其實存在於比應用程式更低的層級？

2. 除了文章提到的OSI模型，還有哪些心智模型或框架（例如：CAP理論、SOLID原則）能幫助開發者更系統化地思考和解決問題？

3. 對於前端開發者或行動應用開發者來說，這套分層除錯的思維模式應如何調整以適應他們特定的技術棧和運行環境？