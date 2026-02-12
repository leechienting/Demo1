// 建立彈出式解釋視窗
let tooltipDiv = null;
let currentSelection = '';
let currentContext = '';

// 監聽文字選取事件
document.addEventListener('mouseup', async (e) => {
  // 等待一小段時間確保選取完成
  setTimeout(async () => {
    const selectedText = window.getSelection().toString().trim();

    // 如果有選取文字且不是在我們的 tooltip 內點擊
    if (selectedText && !e.target.closest('.ai-tooltip')) {
      currentSelection = selectedText;

      // 獲取上下文（選取文字前後各 100 個字元）
      currentContext = getContext(selectedText);

      // 顯示載入中的 tooltip
      showTooltip(e.pageX, e.pageY, '正在分析中...', true);

      // 取得 AI 解釋
      try {
        const explanation = await getAIExplanation(selectedText, currentContext);
        showTooltip(e.pageX, e.pageY, explanation, false);
      } catch (error) {
        showTooltip(e.pageX, e.pageY, `錯誤: ${error.message}`, false);
      }
    }
  }, 10);
});

// 點擊其他地方時隱藏 tooltip
document.addEventListener('mousedown', (e) => {
  if (tooltipDiv && !e.target.closest('.ai-tooltip')) {
    hideTooltip();
  }
});

// 獲取選取文字的上下文
function getContext(selectedText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return '';

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const textContent = container.textContent || container.parentNode.textContent;

  const selectedIndex = textContent.indexOf(selectedText);
  const contextStart = Math.max(0, selectedIndex - 100);
  const contextEnd = Math.min(textContent.length, selectedIndex + selectedText.length + 100);

  return textContent.substring(contextStart, contextEnd);
}

// 顯示解釋視窗
function showTooltip(x, y, content, isLoading) {
  // 移除舊的 tooltip
  hideTooltip();

  // 建立新的 tooltip
  tooltipDiv = document.createElement('div');
  tooltipDiv.className = 'ai-tooltip';
  if (isLoading) {
    tooltipDiv.classList.add('loading');
  }

  // 建立內容區域
  const contentDiv = document.createElement('div');
  contentDiv.className = 'tooltip-content';
  contentDiv.innerHTML = content;

  tooltipDiv.appendChild(contentDiv);

  // 如果不是載入中，加入儲存按鈕
  if (!isLoading) {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'tooltip-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '💾 加入單字表';
    saveBtn.onclick = () => saveToVocabulary(currentSelection, content);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '✕';
    closeBtn.onclick = hideTooltip;

    buttonDiv.appendChild(saveBtn);
    buttonDiv.appendChild(closeBtn);
    tooltipDiv.appendChild(buttonDiv);
  }

  document.body.appendChild(tooltipDiv);

  // 定位 tooltip
  positionTooltip(x, y);
}

// 定位 tooltip（確保不超出視窗）
function positionTooltip(x, y) {
  if (!tooltipDiv) return;

  const tooltipRect = tooltipDiv.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = x + 10;
  let top = y + 10;

  // 防止超出右邊界
  if (left + tooltipRect.width > viewportWidth) {
    left = x - tooltipRect.width - 10;
  }

  // 防止超出下邊界
  if (top + tooltipRect.height > viewportHeight + window.scrollY) {
    top = y - tooltipRect.height - 10;
  }

  tooltipDiv.style.left = left + 'px';
  tooltipDiv.style.top = top + 'px';
}

// 隱藏 tooltip
function hideTooltip() {
  if (tooltipDiv) {
    tooltipDiv.remove();
    tooltipDiv = null;
  }
}

// 取得 AI 解釋
async function getAIExplanation(text, context) {
  // 從 storage 取得 API key
  const result = await chrome.storage.sync.get(['apiKey', 'targetLanguage']);
  const apiKey = result.apiKey;
  const targetLanguage = result.targetLanguage || '繁體中文';

  if (!apiKey) {
    throw new Error('請先在擴充功能設定中輸入 API Key');
  }

  // 傳送訊息給 background script 來處理 API 呼叫
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'getExplanation',
        text: text,
        context: context,
        apiKey: apiKey,
        targetLanguage: targetLanguage
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || '無法取得 AI 解釋'));
        }
      }
    );
  });
}

// 儲存到單字表
async function saveToVocabulary(word, explanation) {
  try {
    // 取得現有的單字表
    const result = await chrome.storage.local.get(['vocabulary']);
    const vocabulary = result.vocabulary || [];

    // 加入新單字（附帶時間戳記）
    vocabulary.unshift({
      word: word,
      explanation: explanation,
      context: currentContext,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // 儲存回 storage（最多保留 500 個）
    await chrome.storage.local.set({
      vocabulary: vocabulary.slice(0, 500)
    });

    // 顯示成功訊息
    const saveBtn = tooltipDiv.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.textContent = '✓ 已加入';
      saveBtn.disabled = true;
      saveBtn.style.background = '#48bb78';
    }

    // 3 秒後關閉 tooltip
    setTimeout(hideTooltip, 1500);
  } catch (error) {
    alert('儲存失敗：' + error.message);
  }
}
