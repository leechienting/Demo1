**一、清除模擬器上所有APP ：**\
`xcrun simctl erase all`\
`或`xcrun simctl erase \[特定模擬器ID\]\
—————————————————

**二、Appium Server啟用更詳細的日誌**：

- 啟動 Appium 時加上 `--log-level debug` 參數

- 在 capabilities 中設置 `"showXcodeLog": true` 和 `"showIOSLog": true`


