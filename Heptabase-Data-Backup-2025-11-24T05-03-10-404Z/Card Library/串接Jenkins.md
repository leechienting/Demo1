# 串接Jenkins

太棒了！現在我們要把你這套流程 **串接進 Jenkins 自動化流程**，讓你可以一鍵完成：

👉 Appium 腳本 ➜ 自動轉操作描述 ➜ 產出 `.feature` ➜ 執行測試 ➜ 產出報告\
這套流程適用於 **iOS 自動化測試 + BDD（Cucumber）架構**

---

## 🧩 Jenkins 串接流程總覽

```
🔁 Jenkins Job 觸發（手動或排程）
  ├─ Step 1：執行 Java Appium 測試腳本 ➜ 擷取操作 / 或讀取腳本
  ├─ Step 2：Python script 萃取操作描述 ➜ 自動轉換
  ├─ Step 3：Python script 呼叫 OpenAI API ➜ 產出 `.feature`
  ├─ Step 4：執行 Cucumber 測試（Gradle/Maven）
  └─ Step 5：輸出測試報告（HTML 或 Allure）
```

---

## ✅ Jenkins 基礎準備

### ✅ Jenkins 所需安裝：

| 套件 / 工具 | 說明 | 
|---|---|
| Java + Gradle | 執行 Cucumber 測試 | 
| Python 3 + openai 套件 | 呼叫 AI 串產生 `.feature` | 
| Appium Server | 必要的背景服務（建議設成 Jenkins slave 上常駐） | 
| Node.js + Appium CLI | 建立 iOS 測試環境 | 
| Xcode Command Line Tools | iOS 模擬器控制 | 

---

## 📄 Jenkinsfile 範例（Pipeline）

以下是一份範例 Jenkins Pipeline，使用 Gradle + Python script：

```groovy
pipeline {
  agent any

  environment {
    OPENAI_API_KEY = credentials('openai-api-key') // 在 Jenkins 中設定密鑰憑證
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('生成操作描述') {
      steps {
        sh 'python3 scripts/java_to_description.py'
      }
    }

    stage('呼叫 AI 產出 .feature') {
      steps {
        sh 'python3 scripts/generate_feature.py'
      }
    }

    stage('執行 Cucumber 測試') {
      steps {
        sh './gradlew clean test'
      }
    }

    stage('產出報告') {
      steps {
        publishHTML(target: [
          reportDir: 'build/reports/tests/test',
          reportFiles: 'index.html',
          reportName: 'Test Report'
        ])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '**/*.feature', fingerprint: true
    }
  }
}
```

---

## 📂 目錄結構建議

```
project/
├─ scripts/
│  ├─ java_to_description.py        ← 將 Appium Java 腳本 ➜ 操作描述
│  └─ generate_feature.py           ← 操作描述 ➜ 呼叫 AI 產生 .feature
├─ src/
│  ├─ test/
│  │  ├─ java/
│  │  │  ├─ stepdefinitions/
│  │  │  └─ runners/
│  │  └─ resources/features/
│  │     └─ generated_login_logout.feature  ← 自動產出的 feature
├─ Jenkinsfile
├─ build.gradle
└─ requirements.txt  ← 列出 python openai 套件
```

---

## ✅ Python 套件安裝（Jenkins 要跑）

請建立一個 `requirements.txt`：

```
openai
```

然後在 Jenkins 環境中跑一次：

```bash
pip install -r requirements.txt
```

或在 Jenkinsfile 加入這行：

```groovy
sh 'pip install -r requirements.txt'
```

---

## 🧠 延伸建議（可選）

| 功能 | 建議方式 | 
|---|---|
| 自動 Commit `.feature` 到 Git | `sh 'git commit && git push'` | 
| 自動寄送報告結果 | 使用 Jenkins Email Extension Plugin | 
| 多模擬器分流執行 | 加入 label 與 parallel branch | 
| 多場景畫面處理 | 設定多段 `.feature` 批次生成與執行 | 

---

## 🚀 下一步我可以幫你：

1. 🛠 幫你補上 `java_to_description.py` + `generate_feature.py` 兩個 script 檔案

2. 📦 建立一份可直接丟上 Jenkins 的最小專案架構（含 Gradle/Cucumber/Test）

3. 🧪 提供一個 iOS Appium 測試腳本 + 模擬器測試設定範例

你想先我幫你做哪一部分呢？還是你要我幫你生出一份完整空專案 zip？😎