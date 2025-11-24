# 第一章 LLM概述

---

以下為第25頁～第57頁（Chapter 1）之逐字繁體中文翻譯。為維持可讀性，我在首次出現時同時保留了關鍵技術術語的中英文對照；專有人名一律保留原語言。文中「圖」與「表」之編號、標題與說明，依原文情境翻譯；若原頁面為重複內容，我僅譯其一次以避免冗贅；若為圖片本體，僅翻譯其標題與圖說。

### — 第25頁 —

## 章節標題：An Introduction to Large Language Models\
大型語言模型簡介

人類正處在一個轉折點上。自 2012 年起，使用深度神經網路（deep neural networks）打造 AI 系統的進展加速推進；到該年代末期，終於產生了第一個能寫出與人類撰文幾可亂真的軟體系統。這個系統是一個名為 Generative Pre-trained Transformer 2（GPT-2，生成式預訓練轉換器 2）的 AI 模型。2022 年，ChatGPT 發佈，清楚展示出這項技術將如何深刻改變我們與科技與資訊互動的方式。它在 5 天內達到一百萬名活躍用戶，兩個月內突破一億活躍用戶；這一代的新式 AI 模型起初以擬人化聊天機器人的樣貌出現，但很快就演變成我們處理常見任務（例如翻譯、文字生成、摘要等）的方法論大改造。它成為程式設計師、教育工作者與研究人員的無價工具。  

ChatGPT 的成功前所未有，並使得其背後技術——大型語言模型（Large Language Models, LLMs）——的研究空前熱絡。專有（proprietary）與公開（public）模型皆以穩定的節奏推出，逐步縮小、甚至追上 ChatGPT 的表現。可以毫不誇張地說，幾乎所有的聚光燈都照在 LLMs 上。  

因此，至少對我們而言，2023 年將永遠被記為徹底改變我們領域——語言人工智慧（Language Artificial Intelligence, Language AI）——的一年；此領域以開發能理解與生成自然語言的系統為特徵。  

然而，LLMs 其實已經存在一段時間，而且較小的模型至今仍然很重要。LLM 遠不只是一個單一模型；在語言 AI 領域還有許多值得探索的技術與模型。  

在本書中，我們希望讀者能扎實理解 LLM 與整體語言 AI 的基礎。作為全書的支架，本章將引介我們在後續章節中會反覆使用的觀念與術語。  

### — 第26頁 —

但更重要的是，本章將回答以下問題：  

- 什麼是語言 AI（Language AI）？  

- 什麼是大型語言模型（large language models, LLMs）？  

- 大型語言模型的常見應用情境與使用案例是什麼？  

- 我們要如何親自使用大型語言模型？  

### 小節標題：What Is Language AI?\
什麼是語言 AI？

「人工智慧（Artificial Intelligence, AI）」一詞，常用來描述致力於執行接近人類智慧任務的電腦系統，例如語音辨識、語言翻譯與視覺感知。它是軟體的智慧，相對於人類的智慧。  

以下是人工智慧領域創始人之一對 AI 的較為正式的定義：  

\[人工智慧是\] 使機器變得聰明的科學與工程，特別是智能電腦程式。它與利用電腦理解人類智慧的相似任務有關，但 AI 不必侷限於生物上可觀察的方法。\
— John McCarthy，2007  

由於 AI 的定義與範圍持續演變，這個詞被用於描述形形色色的系統，其中有些其實並未真正展現「智能」行為。例如電腦遊戲中的角色（non-playable characters, NPCs），過去常被稱為「AI」，但不少不過是 if-else 條件判斷的集合。  

「語言 AI（Language AI）」指的**是 *****AI 的一個子領域***，專注於開發能理解、處理與生成自然語言的技術。隨著機器學習方法持續在語言處理問題上取得成功，語言 AI 這個詞常與自然語言處理（Natural Language Processing, NLP）交替使用。  

### — 第27頁 —

我們使用「語言 AI」這個詞，去涵蓋那些技術上也許不是 LLM，卻仍對此領域產生重大影響的技術；例如檢索系統（retrieval systems）能賦予 LLM 超能力（詳見第 8 章）。  

在本書中，我們將聚焦於那些形塑語言 AI 發展的關鍵模型，這表示我們不只會孤立地談 LLM。本章要先回答：什麼是大型語言模型？在此之前，先快速回顧語言 AI 的發展史。  

### 小節標題：A Recent History of Language AI\
語言 AI 的近期發展史

語言 AI 的歷史，涵蓋了許多旨在表徵（represent）與生成語言的發展與模型，如圖 1-1 所示。  

然而，對電腦而言，「語言」是一個難題。文字本質上是不結構化（unstructured）的，若只以 0 與 1（單一字元）來表現，就會喪失其意義。因此，在語言 AI 的歷史中，如何把語言結構化以便電腦使用，一直是核心焦點。圖 1-2 展示了語言 AI 任務的例子。  

![image.png](./第一章%20LLM概述-assets/image.png)

圖 1-1：一瞥語言 AI 的歷史。

![image.png](./第一章%20LLM概述-assets/image.png)

圖 1-2：語言 AI 透過處理文字輸入，可執行多種任務。  

### — 第28頁 —

### 小節標題：Representing Language as a Bag-of-Words\
以「詞袋模型（bag-of-words, BOW）」表徵語言

我們的歷史從一種稱為「詞袋模型」的技巧開始，這是一種用來表徵不結構化文字的方法。它約在 1950 年代被提出，但在 2000 年代前後變得流行。  

詞袋模型的運作方式如下：假設我們有兩個句子，想為它們建立數值化表示。第一步是「斷詞／分詞（tokenization）」，也就是把句子分割為個別的單詞或次詞（subwords；統稱為 tokens），如圖 1-3 所示。  

最常見的斷詞方法是以空白字元切分，形成單詞。不過這也有缺點，因為某些語言（例如中文）在單詞前後並沒有空白。下一章我們將深入探討斷詞，以及它如何影響語言模型。接著，如圖 1-4 所示，斷詞後把兩個句子的所有不重複單字彙整，建立一個字彙表（vocabulary），以便用來表徵句子。  

![ESG\_永續發展測驗.png.jpg](./第一章%20LLM概述-assets/ESG_永續發展測驗.png.jpg)

圖 1-3：將每個句子以空白切分成單字（tokens）。

![ESG\_永續發展測驗.png.jpg](./第一章%20LLM概述-assets/ESG_永續發展測驗.png.jpg)

圖 1-4：保留兩句中所有不重複的單字，建立字彙表。  

### — 第29頁 —

接著使用這個字彙表，我們只要統計每個句子中各字出現的次數——字面上就形成了一個「詞的袋子」。因此，詞袋模型試圖把文字以數字形式來表示（稱為向量、vector representation），如圖 1-5。全書中，我們把這類模型稱為「表徵模型（representation models）」。  

![ESG\_永續發展測驗.png.jpg](./第一章%20LLM概述-assets/ESG_永續發展測驗.png.jpg)

圖 1-5：以計數形成詞袋；這些數值即向量表示。  

雖然詞袋是經典方法，但並未完全過時；在第 5 章我們會看到，如何把它拿來補強較新的語言模型。  

### — 第30頁 —

### 小節標題：Better Representations with Dense Vector Embeddings\
用稠密向量嵌入（dense vector embeddings）獲得更好的表徵

詞袋雖優雅，卻有一個缺陷：它把語言視為近乎字面意義的「詞之集合」，忽略了文字的語義（semantic）或意義層面。  

2013 年發表的 word2vec，是最早成功以「嵌入（embeddings）」捕捉語義的嘗試之一。嵌入是資料的向量化表示，目標在捕捉其含義。為此，word2vec 在龐大的文本語料上訓練（例如整個維基百科），來學得單詞的語義表示。  

為生成這些語義表示，word2vec 使用神經網路（neural networks）。神經網路由相互連結的節點層構成以處理資訊，如圖 1-6 所示；其可包含多層，每一個連結都有對應的權重（weights），通常也稱為模型的參數（parameters）。  

![image.png](./第一章%20LLM概述-assets/image.png)

圖 1-6：神經網路由相互連結的節點層構成，每個連結代表一個線性關係。  

在訓練過程中，word2vec 透過觀察「某個詞在句子裡傾向與哪些詞相鄰」來學得詞嵌入。我們一開始為字彙表中的每個字分配一個向量（例如長度 50），並以隨機值初始化。之後每一步訓練，如圖 1-7 所示，取出語料中的詞對，訓練一個模型去預測它們是否可能在句子中互為鄰近詞。  

### — 第31頁 —

在此過程中，word2vec 學會詞與詞之間的關係，並將這些資訊「蒸餾」到嵌入裡。如果兩個詞傾向具有相似的鄰居，則它們的嵌入會彼此靠近，反之亦然。第 2 章我們會更細看 word2vec 的訓練流程。  

![Hands-On_Large_Language_Models-\_Language_Understanding_and\_--\_Jay_Alammar__Maarten_Grootendorst\_.png.jpg](./第一章%20LLM概述-assets/Hands-On_Large_Language_Models-_Language_Understanding_and_--_Jay_Alammar__Maarten_Grootendorst_.png.jpg)

圖 1-7：訓練一個神經網路來預測兩詞是否為鄰居；嵌入會隨之更新趨近真值。  

得到的嵌入能捕捉詞的意義——但這到底代表什麼？為了說明，我們稍微簡化地想像有一些詞的嵌入，例如「apple」與「baby」。嵌入試圖以「性質（properties）」來表示詞的意義；例如「baby」在「newborn（新生兒）」與「human（人類）」這兩個性質上可能得分很高，而「apple」則很低。  

如圖 1-8 所示，嵌入可由許多性質構成，以表徵詞義。由於嵌入維度固定，會以一組性質來形塑「心智圖像」。實務上，這些性質往往晦澀，少有單一可辨識的人類概念；然而它們的組合對電腦而言是有用的，成為把人類語言轉譯為電腦語言的好方法。  

![Hands-On_Large_Language_Models-\_Language_Understanding_and\_--\_Jay_Alammar__Maarten_Grootendorst\_.png.jpg](./第一章%20LLM概述-assets/Hands-On_Large_Language_Models-_Language_Understanding_and_--_Jay_Alammar__Maarten_Grootendorst_.png.jpg)

圖 1-8：嵌入中的各維度可視為用來表徵詞義的「性質」值（此為直觀化示意，而非逐維對應實體概念）。  

### — 第32頁 —

嵌入極為實用，因為它能讓我們測量兩個詞的語義相似度（semantic similarity）。透過不同的距離度量（distance metrics），我們可以評估兩詞的接近程度。如圖 1-9，若把嵌入壓縮到二維，你會看到語義相近的詞往往距離更近。第 5 章我們會探討如何把嵌入壓縮到 n 維空間的可視化。  

### 小節標題：Types of Embeddings\
嵌入的類型

嵌入有很多類型，例如詞嵌入（word embeddings）與句子嵌入（sentence embeddings），用以表示不同抽象層級（詞 vs. 句子），如圖 1-10。  

例如，詞袋在文件層級（document-level）產生嵌入，因為它代表整個文件；相較之下，word2vec 僅為「詞」生成嵌入。  

在本書中，嵌入是核心主角，被廣泛用於許多應用：如分類（第 4 章）、分群（第 5 章）、以及語意搜尋與檢索增強生成（Retrieval-Augmented Generation, RAG；第 8 章）。第 2 章我們會首次深入「token 嵌入」。  

![Hands-On_Large_Language_Models-\_Language_Understanding_and\_--\_Jay_Alammar__Maarten_Grootendorst\_.png.jpg](./第一章%20LLM概述-assets/Hands-On_Large_Language_Models-_Language_Understanding_and_--_Jay_Alammar__Maarten_Grootendorst_.png.jpg)

圖 1-9：語義相近的詞，在嵌入空間中彼此更接近。

![Hands-On_Large_Language_Models-\_Language_Understanding_and\_--\_Jay_Alammar__Maarten_Grootendorst\_.png.jpg](./第一章%20LLM概述-assets/Hands-On_Large_Language_Models-_Language_Understanding_and_--_Jay_Alammar__Maarten_Grootendorst_.png.jpg)

圖 1-10：可為不同輸入類型建立嵌入。  

### — 第33頁 —

### 小節標題：Encoding and Decoding Context with Attention\
用注意力機制（attention）編碼與解碼脈絡

word2vec 的訓練產生的是「靜態、可下載」的詞表示。例如「bank」不論脈絡如何，其嵌入皆相同；但「bank」既可能指「金融機構」也可能指「河岸」，其意義——也就是嵌入——應隨語境而改變。  

在把脈絡編碼進文字的路上，循環神經網路（Recurrent Neural Networks, RNNs）邁出一步。RNN 是能以序列作為額外輸入的一種神經網路變體。  

它們被用於兩個工作：編碼（encoding，表徵輸入句子）與解碼（decoding，生成輸出句子）。圖 1-11 展示了這個概念：例如把 “I love llamas” 翻譯成荷蘭文 “Ik hou van lama’s”。  

### — 第34頁 —

在此架構下，每一步皆為自回歸（autoregressive）：生成下一個詞時，模型必須「消化」先前已生成的所有詞，如圖 1-12。  

編碼階段的目標是盡可能表示輸入，把脈絡濃縮成一個嵌入（context embedding），供解碼器使用。為了產生這個表示，它接受「詞嵌入」作為輸入——因此我們可以用 word2vec 的表示作為初始詞嵌入。此過程如圖 1-13；注意輸入與輸出都以序列順序逐一處理。  

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-11：兩個 RNN（編碼器與解碼器）把英文翻成荷文。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-12：每個先前的輸出 token 都回饋為下一步的輸入。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-13：以 word2vec 嵌入產生代表整個序列的脈絡嵌入。  

### — 第35頁 —

然而，僅以一個「脈絡嵌入」表示整個輸入，使得處理長句變得困難。2014 年，一個稱為「注意力（attention）」的解法被提出並大幅改進了該架構。注意力讓模型能聚焦於輸入序列中彼此相關的部分（彼此「關注/對齊」），並強化相應的訊號，如圖 1-14 所示；它會選擇性地判定句中哪些詞在當下最重要。  

例如，輸出詞 “lama’s”（荷文的「llamas」）與輸入中的 “llamas” 關聯很強，因此注意力權重高；相對地，“lama’s” 與 “I” 關聯低。第 3 章我們會更深入解釋注意力機制。  

### — 第36頁 —

把注意力加到解碼器後，RNN 能為每個輸入詞產生與「候選輸出」相關的訊號；也就是不再只傳遞單一脈絡嵌入，而是把所有輸入詞的隱狀態（hidden states）都交給解碼器，如圖 1-15 所示。結果是：在生成 “Ik hou van lama’s” 的過程中，RNN 會持續追蹤它當下「最關注」的輸入詞來完成翻譯。相較 word2vec，這個架構能表示文字的序列性與脈絡性——但其序列性也使得模型訓練難以並行化。  

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-14：注意力讓模型「關注」序列中彼此關係強弱不一的部分。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-15：在生成 “Ik”、“hou”、“van” 之後，解碼器的注意力聚焦在 “llamas”，以便生成荷文 “lama’s”。  

### — 第37頁 —

### 小節標題：Attention Is All You Need\
「只要注意力就夠了」

注意力真正的威力——也是推動 LLM 驚人能力的關鍵——在 2017 年著名的論文 “Attention Is All You Need” 中首次獲得集中探討。作者提出了一種只基於注意力機制、不含前述遞迴網路的架構：Transformer（轉換器）。與遞迴網路相比，Transformer 可在訓練時並行處理，大幅加速訓練。  

在 Transformer 中，編碼器（encoder）與解碼器（decoder）元件各自堆疊，如圖 1-16。此架構仍是自回歸：在生成下一個詞前，必須先消化當前已生成的詞。  

現在，編碼器與解碼器都以「注意力」為核心，而不是「RNN + 注意力」。Transformer 的編碼器區塊包含兩部分：自注意力（self-attention）與前饋式神經網路（feedforward neural network），如圖 1-17。  

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-16：Transformer 由堆疊的編碼器與解碼器區塊組成；輸入依序通過各層。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-17：編碼器區塊以自注意力產生中介表示。  

### — 第38頁 —

相較於先前的注意力作法，自注意力能在單一序列內對不同位置彼此關注，因此更容易、也更準確地表徵輸入序列，如圖 1-18；而且它不是一次只處理一個 token，而是能「一口氣觀察整個序列」。  

解碼器相較編碼器，多了一層「關注編碼器輸出」的注意力（encoder attention），以便找出輸入中與輸出最相關的部分，如圖 1-19；其概念與前述 RNN 的注意力解碼器相似。  

### — 第39頁 —

同時，解碼器中的自注意力會對「未來位置」加上遮罩（mask），只允許關注較早的輸出，避免在生成時「偷看未來資訊」，如圖 1-20。  

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-18：自注意力在單序列中同時向前與向後關注。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-19：解碼器多了「編碼器注意力」層，去關注編碼器的輸出。

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-20：僅關注先前 token，以避免「看見未來」。  

這些構件共同形成 Transformer 架構，成為語言 AI 中多個具深遠影響模型（如 BERT 與 GPT-1）的基礎。全書大多使用基於 Transformer 的模型。  

### — 第40頁 —

Transformer 還有許多我們尚未提及的重點；第 2、3 章將討論為何 Transformer 表現如此優異的多個原因，包括多頭注意力（multi-head attention）、位置嵌入（positional embeddings）與層正規化（layer normalization）。  

### 小節標題：Representation Models: Encoder-Only Models\
表徵模型：僅編碼器（encoder-only）模型

原始 Transformer 是「編碼器—解碼器（encoder–decoder）」架構，很適合翻譯等序列到序列（seq2seq）任務，但不易直接用於其他任務（如文字分類）。  

2018 年，一個名為「Bidirectional Encoder Representations from Transformers（BERT，雙向編碼器表示）」的新架構被提出。它能應對多種任務，並在多年內成為語言 AI 的基石。BERT 採「僅編碼器」設計，專注於語言表徵，如圖 1-21；也就是僅使用編碼器、完全去除解碼器。  

![⏰\_書籍\_Books.png.jpg](./第一章%20LLM概述-assets/⏰_書籍_Books.png.jpg)

圖 1-21：BERT base 的架構示意（12 個編碼器層）。  

這些編碼器區塊與前述相同：自注意力，接著前饋網路。輸入中包含一個額外的 \[CLS\]（classification）token，用作整段輸入的整體表示。我們常使用這個 \[CLS\] 向量作為下游任務（如分類）微調（fine-tuning）的輸入嵌入。  