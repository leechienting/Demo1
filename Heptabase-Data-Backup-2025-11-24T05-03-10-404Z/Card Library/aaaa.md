# aaaa

你要的是「開啟 Appium session ➜ 人手動操作模擬器 ➜ 每次手動操作完後，執行一個函式來儲存目前畫面的 XML」，那我來幫你改成這種半自動形式。

---

## ✅ Python 腳本：**手動操作 + 每次儲存 XML**

```python
from appium import webdriver
import time
import os

# 儲存 XML 的資料夾
OUTPUT_DIR = "xml_snapshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 設定 Desired Capabilities
desired_caps = {
    "platformName": "iOS",
    "platformVersion": "17.2",  # 替換為你的版本
    "deviceName": "iPhone 14 Pro",  # 替換為模擬器名稱
    "automationName": "XCUITest",
    "app": "/path/to/your.app",  # 或使用 bundleId
    "noReset": True
}

# 建立 Appium 連線
driver = webdriver.Remote("http://localhost:4723/wd/hub", desired_caps)

# 等待手動開啟 App 初始化
print("✅ App launched. 請開始手動操作 App。")
print("🔁 每次操作完後，請按 Enter 儲存畫面 XML。按 'q' 離開。")

step = 1
while True:
    user_input = input(f"\n▶ 操作完成？按 Enter 儲存第 {step} 步 XML（或輸入 q 離開）：")
    if user_input.strip().lower() == 'q':
        break
    xml = driver.page_source
    filename = f"{OUTPUT_DIR}/step_{step:02d}.xml"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(xml)
    print(f"✅ 已儲存：{filename}")
    step += 1

# 關閉 driver
driver.quit()
print("🚗 Appium session 已結束。")
```

---

### 🪄 使用方式

1. 啟動這個腳本，它會開啟模擬器 App。

2. 手動操作 App。

3. 每當你完成一個操作畫面，就「回到 Terminal 按 Enter」來儲存 XML。

4. 輸入 `q` 結束。

---

### ✅ 優點

- 適合 **探索式操作**。

- 你可以搭配 Appium Inspector 一邊觀察元素、一邊用這支 script 儲存畫面結構。

- 每頁都會自動命名成 `step_01.xml`、`step_02.xml`……

---

準備好之後，我們就可以繼續：「如何把這些 XML 送去轉換成 `.feature` 和 Kotlin step 定義」囉。你這邊要不要先試跑看看這個 script？如果你有產生的 XML，我也可以幫你示範轉換！