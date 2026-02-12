// Background Service Worker - 處理 API 呼叫

// 監聽來自 content script 的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getExplanation') {
    // 非同步處理 API 呼叫
    handleGetExplanation(request.text, request.context, request.apiKey, request.targetLanguage)
      .then(response => {
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });

    // 返回 true 表示會非同步回應
    return true;
  }
});

// 呼叫 Claude API 取得解釋
async function handleGetExplanation(text, context, apiKey, targetLanguage) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `請用${targetLanguage}解釋以下文字的意思。如果是單字，請提供：1) 詞性 2) 中文意思 3) 在此上下文中的用法。如果是片語或句子，請解釋其含義和用法。請簡潔明瞭。

選取的文字：「${text}」

上下文：「${context}」`
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);

      // 提供更詳細的錯誤訊息
      let errorMessage = '無法取得 AI 解釋';

      if (errorData.error) {
        if (errorData.error.type === 'authentication_error') {
          errorMessage = 'API Key 無效或已過期，請檢查設定';
        } else if (errorData.error.type === 'permission_error') {
          errorMessage = 'API Key 權限不足';
        } else if (errorData.error.type === 'not_found_error') {
          errorMessage = '模型不存在或無法存取';
        } else if (errorData.error.type === 'rate_limit_error') {
          errorMessage = 'API 使用次數超過限制，請稍後再試';
        } else if (errorData.error.type === 'overloaded_error') {
          errorMessage = 'API 伺服器忙碌中，請稍後再試';
        } else {
          errorMessage = errorData.error.message || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
