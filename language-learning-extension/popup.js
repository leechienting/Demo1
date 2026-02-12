// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 載入設定
  await loadSettings();

  // 載入單字表
  await loadVocabulary();

  // 設定標籤切換
  setupTabs();

  // 設定按鈕事件
  setupButtons();
});

// 標籤切換
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      // 移除所有 active 類別
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // 加入 active 類別
      tab.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// 設定按鈕事件
function setupButtons() {
  // 測試 API Key
  document.getElementById('testApiBtn').addEventListener('click', testApiKey);

  // 儲存設定
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

  // 匯出單字表
  document.getElementById('exportBtn').addEventListener('click', exportVocabulary);

  // 清空單字表
  document.getElementById('clearBtn').addEventListener('click', clearVocabulary);
}

// 載入設定
async function loadSettings() {
  const result = await chrome.storage.sync.get(['apiKey', 'targetLanguage']);

  if (result.apiKey) {
    document.getElementById('apiKey').value = result.apiKey;
  }

  if (result.targetLanguage) {
    document.getElementById('targetLanguage').value = result.targetLanguage;
  }
}

// 測試 API Key
async function testApiKey() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const testBtn = document.getElementById('testApiBtn');

  if (!apiKey) {
    showStatus('請先輸入 API Key', 'error');
    return;
  }

  // 顯示測試中
  testBtn.disabled = true;
  testBtn.textContent = '🔄 測試中...';
  showStatus('正在測試 API Key...', 'success');

  try {
    // 傳送測試訊息給 background script
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: 'getExplanation',
          text: 'test',
          context: 'This is a test',
          apiKey: apiKey,
          targetLanguage: '繁體中文'
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });

    if (response.success) {
      showStatus('✅ API Key 有效！可以正常使用', 'success');
    } else {
      showStatus('❌ ' + response.error, 'error');
    }
  } catch (error) {
    showStatus('❌ 測試失敗：' + error.message, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = '🔍 測試 API Key';
  }
}

// 儲存設定
async function saveSettings() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const targetLanguage = document.getElementById('targetLanguage').value;
  const statusMessage = document.getElementById('statusMessage');

  if (!apiKey) {
    showStatus('請輸入 API Key', 'error');
    return;
  }

  try {
    await chrome.storage.sync.set({
      apiKey: apiKey,
      targetLanguage: targetLanguage
    });

    showStatus('設定已儲存！', 'success');
  } catch (error) {
    showStatus('儲存失敗：' + error.message, 'error');
  }
}

// 顯示狀態訊息
function showStatus(message, type) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = message;
  statusMessage.className = 'status-message ' + type;

  setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 3000);
}

// 載入單字表
async function loadVocabulary() {
  const result = await chrome.storage.local.get(['vocabulary']);
  const vocabulary = result.vocabulary || [];
  const container = document.getElementById('vocabularyList');
  const countElement = document.getElementById('vocabCount');

  // 更新計數
  countElement.textContent = `共 ${vocabulary.length} 個單字`;

  // 清空容器
  container.innerHTML = '';

  if (vocabulary.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📚</div>
        <div class="empty-state-text">還沒有單字<br>選取網頁上的文字開始學習吧！</div>
      </div>
    `;
    return;
  }

  // 顯示每個單字
  vocabulary.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'vocab-item';

    const date = new Date(item.timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    itemDiv.innerHTML = `
      <div class="vocab-word">${escapeHtml(item.word)}</div>
      <div class="vocab-explanation">${escapeHtml(item.explanation)}</div>
      <div class="vocab-meta">
        <span>📅 ${date}</span>
        <button class="delete-btn" data-index="${index}">🗑️ 刪除</button>
      </div>
    `;

    // 加入刪除事件
    itemDiv.querySelector('.delete-btn').addEventListener('click', () => {
      deleteVocabItem(index);
    });

    container.appendChild(itemDiv);
  });
}

// 刪除單字
async function deleteVocabItem(index) {
  if (!confirm('確定要刪除這個單字嗎？')) {
    return;
  }

  const result = await chrome.storage.local.get(['vocabulary']);
  const vocabulary = result.vocabulary || [];

  vocabulary.splice(index, 1);

  await chrome.storage.local.set({ vocabulary });
  await loadVocabulary();
}

// 匯出單字表
async function exportVocabulary() {
  const result = await chrome.storage.local.get(['vocabulary']);
  const vocabulary = result.vocabulary || [];

  if (vocabulary.length === 0) {
    alert('單字表是空的！');
    return;
  }

  // 建立 CSV 內容
  let csv = '\uFEFF'; // BOM for UTF-8
  csv += '單字,解釋,日期,網址\n';

  vocabulary.forEach(item => {
    const date = new Date(item.timestamp).toLocaleString('zh-TW');
    csv += `"${item.word}","${item.explanation}","${date}","${item.url}"\n`;
  });

  // 下載檔案
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vocabulary_${new Date().getTime()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// 清空單字表
async function clearVocabulary() {
  if (!confirm('確定要清空所有單字嗎？此操作無法復原！')) {
    return;
  }

  await chrome.storage.local.set({ vocabulary: [] });
  await loadVocabulary();
}

// 跳脫 HTML 特殊字元
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
