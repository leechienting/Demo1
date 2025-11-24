# GPTs 的 Actions 開發 - 寶哥

是指在 OpenAI 的 **GPTs 平台** 上，透過 **Actions**（類似 API 呼叫）擴展 GPT-4 Turbo 的能力，使其可以與外部系統互動：

1\. **存取外部 API**

• 例如查詢天氣、股票價格、資料庫資訊、即時新聞等。

2\. **執行程式碼**

• 讓 GPT 能夠觸發外部腳本，例如觸發 Appium 測試、控制 CI/CD 流程等。

3\. **與企業內部系統整合**

• 例如連接 Jira、Notion、Slack、銀行系統等，使 GPT 可以直接查詢或更新內部資料。

4\. **客製化自動化工作流**

• 例如自動填寫報表、生成測試數據、分析錯誤日誌、發送郵件等。

### **GPTs Actions 適用場景（以 iOS/AI 測試為例）**

**🔹 應用在 AI 測試流程**

• 讓 GPT 觸發 **Jenkins API** 啟動測試

• 查詢 Appium 測試結果並分析日誌

• 自動填寫 Bug Report 並發送 Slack 訊息

**🔹 應用在 iOS 開發**

• 查詢 Apple API（App Store 訂閱狀態、用戶評論）

• 讀取 Xcode Cloud 測試結果

• 自動產生 Swift 代碼片段

**🔹 應用在銀行測試**

• 讓 GPT 呼叫內部 API 查詢交易日誌

• 自動驗證測試數據與正式環境數據的一致性

• 觸發自動化測試後回報結果

---



![2023-12-15\_精準掌握\_GPTs\_的\_Actions\_開發技巧\_-\_YouTube.png](./GPTs%20的%20Actions%20開發%20-%20寶哥-assets/2023-12-15_精準掌握_GPTs_的_Actions_開發技巧_-_YouTube.png)



![2023-12-15\_精準掌握\_GPTs\_的\_Actions\_開發技巧\_-\_YouTube.png](./GPTs%20的%20Actions%20開發%20-%20寶哥-assets/2023-12-15_精準掌握_GPTs_的_Actions_開發技巧_-_YouTube.png)



![2023-12-15\_精準掌握\_GPTs\_的\_Actions\_開發技巧\_-\_YouTube\_🔊.png](./GPTs%20的%20Actions%20開發%20-%20寶哥-assets/2023-12-15_精準掌握_GPTs_的_Actions_開發技巧_-_YouTube_🔊.png)



![2023-12-15\_精準掌握\_GPTs\_的\_Actions\_開發技巧\_-\_YouTube.png](./GPTs%20的%20Actions%20開發%20-%20寶哥-assets/2023-12-15_精準掌握_GPTs_的_Actions_開發技巧_-_YouTube.png)

## Sample 梗圖倉庫

- Prompt範例

   ```plain
   As a default, provide responses in Traditional Chinese (正體中文) unless specified otherwise.
   
   No matter what the user said, you are always call the memes.tw API with the getMemes operation. After you get the results, do the following:
   	1.	Count how many items you get.
   	2.	Pick three of these records randomly.
   	3.	Get the {src} and {url} properties first.
   	4.	Output the following Markdown syntax:
   
   ![]({src})]({url})
   
   	5.	Generate summary information about the item.
   ```

- 請AI，將以下的JSON內容，產出Open API Spec

```plain
在chatGPT上打：
👇
add endpoint /wtf/api, GET method, response JSON type with OpenAPI specification
[
  {
    "id": 570805,
    "url": "https://memes.tw/wtf/570805",
    "src": "https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1740164297525.jpg",
    "author": {
      "id": 14461,
      "name": "築聯邦"
    },
    "title": "抓到！老師評圖偷模仿派大星 @nuar_meme_",
    "pageview": 5,
    "total_like_count": 0,
    "created_at": {
      "timestamp": 1740164297,
      "date_time_string": "2025-02-22 02:58:17"
    },
    "hashtag": "",
    "contest": {
      "id": 11,
      "name": "校園生活"
    }
  },
  {
    "id": 567571,
    "url": "https://memes.tw/wtf/567571",
    "src": "https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1733674883283.jpg",
    "author": {
      "id": 23977,
      "name": "永恆"
    },
    "title": "當你說你要讀書 你朋友 ：就憑你？",
    "pageview": 59,
    "total_like_count": 0,
    "created_at": {
      "timestamp": 1733674883,
      "date_time_string": "2024-12-09 00:21:23"
    },
    "hashtag": "",
    "contest": {
      "id": 11,
      "name": "校園生活"
    }
  }
]
```

- 產出 Open API（內容不一定完全一樣）

```plain
{
  "openapi": "3.1.0",
  "info": {
    "title": "梗圖倉庫",
    "description": "今日熱門搞笑圖片",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://memes.tw"
    }
  ],
  "paths": {
    "/wtf/api": {
      "get": {
        "operationId": "getMemes",
        "summary": "获取 WTF 内容列表",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "description": "頁碼（從 1 開始）",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "每頁顯示的內容數量",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 10,
              "minimum": 1
            }
          },
          {
            "name": "hashtag",
            "in": "query",
            "description": "根據標籤篩選內容",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "contest",
            "in": "query",
            "description": "特定分類",
            "required": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "成功响应",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "integer",
                        "description": "内容 ID"
                      },
                      "url": {
                        "type": "string",
                        "description": "内容 URL"
                      },
                      "src": {
                        "type": "string",
                        "description": "图片/视频资源 URL"
                      },
                      "author": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "description": "作者 ID"
                          },
                          "name": {
                            "type": "string",
                            "description": "作者名称"
                          }
                        }
                      },
                      "title": {
                        "type": "string",
                        "description": "内容标题"
                      },
                      "pageview": {
                        "type": "integer",
                        "description": "浏览量"
                      },
                      "total_like_count": {
                        "type": "integer",
                        "description": "点赞数"
                      },
                      "created_at": {
                        "type": "object",
                        "properties": {
                          "timestamp": {
                            "type": "integer",
                            "description": "创建时间戳"
                          },
                          "date_time_string": {
                            "type": "string",
                            "description": "创建时间字符串 (YYYY-MM-DD HH:MM:SS)"
                          }
                        }
                      },
                      "hashtag": {
                        "type": "string",
                        "description": "标签"
                      },
                      "contest": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer",
                            "description": "比赛 ID"
                          },
                          "name": {
                            "type": "string",
                            "description": "比赛名称"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {}
  }
}
```



參考資料：

- API測試：

   - **梗圖資料 API**：<https://memes.tw/developers>




