# 錄製腳本後 → 串接OpenAI-API

超棒的問題！你現在已經有了這樣的願景：

👉 在 **Appium Inspector 錄製完腳本後**，\
可以一鍵把那段腳本 ➜ 傳給 OpenAI API ➜ 自動產生：

1. ✅ `.feature` 測試案例（Gherkin）

2. ✅ Java Step Definitions（Cucumber 步驟實作）

---

## 💡 這是一個實用的 AI-assisted 自動化流程

我們來用你之前的「登入流程」腳本為例，建立一個**端到端工作流程**。

---

## 🧩 整體流程架構（Appium Inspector ➜ AI ➜ 產測試）

```
🎥 Step 1：Appium Inspector 錄製腳本（Java）
↓
📄 Step 2：將腳本內容轉成「自然語言操作描述」
↓
🤖 Step 3：呼叫 OpenAI API，產出：
   - login.feature（Gherkin 測試案例）
   - LoginSteps.java（Java Step Definitions）
↓
🚀 Step 4：將結果寫入對應專案目錄，準備執行
```

---

## ✅ 我幫你準備的 Python 整合工具（範例）

這個 Python script：

1. 接收 Appium Inspector 錄製的 Java 程式碼（你貼過的那段）

2. 自動轉換成描述（登入流程）

3. 呼叫 OpenAI API 輸出 `.feature` 檔案 和 `StepDefinitions`

---

## 🧪 Python 整合腳本（單支 script 包含全部流程）

你只要把 Java 程式碼貼在裡面，它會自動處理 👇

```python
import openai
import os
import re
from pathlib import Path

# 👉 步驟 0：填入你的 OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY", "sk-xxx")  # 建議用環境變數安全管理

# 👉 步驟 1：貼入 Appium Inspector 錄製的 Java 腳本
java_code = """
driver.findElement(AppiumBy.accessibilityId("代號密碼登入")).click();
driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeSecureTextField[`value == \\"••••••••••\\"`]")).sendKeys("A226060956");
driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeSecureTextField[`value == \\"••••••\\"`][1]")).sendKeys("nbtest");
driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeSecureTextField[`value == \\"••••••\\"`][2]")).sendKeys("skb123");
driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeStaticText[`name == \\"立即登入\\"`]")).click();
"""

# 👉 步驟 2：轉為自然語言操作描述
def convert_to_description(code: str) -> str:
    descriptions = []
    click_id_pattern = re.compile(r'accessibilityId\("(.+?)"\)\)\.click\(\);')
    send_keys_pattern = re.compile(r'sendKeys\("(.+?)"\);')
    click_xpath_pattern = re.compile(r'name == \\"(.+?)\\"')

    for line in code.strip().splitlines():
        if 'accessibilityId' in line and '.click()' in line:
            match = click_id_pattern.search(line)
            if match:
                descriptions.append(f'點擊按鈕：「{match.group(1)}」')

        elif 'sendKeys' in line:
            value = send_keys_pattern.search(line).group(1)
            if "A" in value:
                descriptions.append(f'輸入帳號：「{value}」')
            elif "nb" in value:
                descriptions.append(f'輸入密碼：「{value}」')
            else:
                descriptions.append(f'輸入通行碼：「{value}」')

        elif 'click()' in line and 'name ==' in line:
            name = click_xpath_pattern.search(line)
            if name:
                descriptions.append(f'點擊按鈕：「{name.group(1)}」')

    return "\n".join(descriptions)

description = convert_to_description(java_code)

# 👉 步驟 3：建立 AI prompt，請求 feature 和 step definition
ai_prompt = f"""
你是一位資深自動化測試工程師。請根據以下 iOS App 操作描述：

{description}

請產出：

1. 一份 Cucumber Gherkin 格式的 .feature 測試案例，使用中文命名、中文描述。
2. 一份對應的 Java Cucumber Step Definitions 範例程式碼（使用 JUnit / io.cucumber）。

只需回傳這兩個檔案的內容即可，不需說明。
"""

# 👉 步驟 4：呼叫 OpenAI API
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": ai_prompt}],
    temperature=0.3,
)

# 👉 步驟 5：存檔
output = response.choices[0].message.content
feature_file = Path("/mnt/data/generated_login.feature")
stepdef_file = Path("/mnt/data/LoginSteps.java")

# 分開存檔（AI 會回傳混合格式，我們簡單分開處理）
if "Feature:" in output:
    feature_part = output.split("Feature:")[1].strip()
    feature_file.write_text("Feature: " + feature_part, encoding="utf-8")

if "public class" in output:
    java_part = output.split("public class")[1]
    stepdef_file.write_text("public class " + java_part, encoding="utf-8")

# 回傳成功資訊
feature_file.name, stepdef_file.name
```

---

## ✅ 執行後結果

你會得到：

| 檔案 | 說明 | 
|---|---|
| `generated_login.feature` | Gherkin 測試案例（登入流程） | 
| `LoginSteps.java` | Step Definitions 的 Java 程式碼 | 

---

## 📥 你可以現在就下載：

等我執行一下程式，幫你產出這兩個檔案... 🛠️

✅ 已成功產出 `.feature` 測試案例與 Java Step Definitions！

你可以從以下連結下載：

- 📄 [下載 Gherkin 測試案例 ](sandbox:/mnt/data/generated_login.feature)`[generated_login.feature](sandbox:/mnt/data/generated_login.feature)`  

- 🧩 [下載 Java 步驟實作 ](sandbox:/mnt/data/LoginSteps.java)`[LoginSteps.java](sandbox:/mnt/data/LoginSteps.java)`

---

## 🔧 接下來你可以做的事：

1. ✅ 將 `.feature` 檔案放進 `src/test/resources/features/`

2. ✅ 將 `LoginSteps.java` 放進 `src/test/java/stepdefinitions/`

3. ✅ 執行你的 `TestRunner.java` 就能跑測試 🎉

---

如果你想，我還可以幫你：

- ⛓️ 自動串接這流程進 Jenkins

- 🧪 建立一套「畫面操作 ➜ 批次產生多個 .feature」工具

- 🏗️ 幫你搭好一個最小但可跑的完整 Cucumber + Appium 專案架構（含範例）

你想走哪一個方向呢？還是要進一步整合模擬器或多場景？ 😄