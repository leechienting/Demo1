#!/usr/bin/env python3
"""
音訊轉錄腳本 - 快速版本（使用 tiny 模型）
"""
import whisper
import sys
from pathlib import Path
from datetime import datetime

def transcribe_audio(audio_file, model_size="tiny", language="zh"):
    """
    轉錄音訊檔案

    參數:
        audio_file: 音訊檔案路徑
        model_size: 模型大小 (tiny=最快)
        language: 語言代碼 (zh=中文)
    """
    print(f"\n{'='*60}")
    print(f"開始時間: {datetime.now().strftime('%H:%M:%S')}")
    print(f"音訊檔案: {audio_file}")
    print(f"使用模型: {model_size} (快速模式)")
    print(f"{'='*60}\n")

    print(f"正在載入 Whisper {model_size} 模型...")
    model = whisper.load_model(model_size)
    print("✓ 模型載入完成\n")

    print(f"正在轉錄音訊...")
    print("處理中，請稍候...\n")

    # 轉錄音訊
    result = model.transcribe(
        audio_file,
        language=language,
        verbose=True,  # 顯示進度
        task="transcribe"
    )

    return result

def save_transcription(result, output_file):
    """保存轉錄結果到檔案"""
    with open(output_file, 'w', encoding='utf-8') as f:
        # 寫入完整文字
        f.write("=" * 80 + "\n")
        f.write("完整轉錄文字\n")
        f.write("=" * 80 + "\n\n")
        f.write(result["text"].strip() + "\n\n")

        # 寫入帶時間戳的分段文字
        f.write("=" * 80 + "\n")
        f.write("分段轉錄（含時間戳）\n")
        f.write("=" * 80 + "\n\n")

        for segment in result["segments"]:
            start_time = format_timestamp(segment["start"])
            end_time = format_timestamp(segment["end"])
            text = segment["text"].strip()
            f.write(f"[{start_time} --> {end_time}]\n{text}\n\n")

    print(f"\n{'='*60}")
    print(f"✓ 轉錄完成！")
    print(f"完成時間: {datetime.now().strftime('%H:%M:%S')}")
    print(f"結果已保存至: {output_file}")
    print(f"{'='*60}\n")

def format_timestamp(seconds):
    """將秒數轉換為 HH:MM:SS 格式"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

if __name__ == "__main__":
    # 設定檔案路徑
    audio_file = "/Users/chientinglee/Documents/Project/Demo1/科會.m4a"
    output_file = "/Users/chientinglee/Documents/Project/Demo1/科會_轉錄_快速版.txt"

    # 檢查檔案是否存在
    if not Path(audio_file).exists():
        print(f"錯誤：找不到音訊檔案 {audio_file}")
        sys.exit(1)

    # 執行轉錄（使用 tiny 模型，速度最快）
    result = transcribe_audio(audio_file, model_size="tiny", language="zh")

    # 保存結果
    save_transcription(result, output_file)

    print("提示：")
    print("• 這是使用 tiny 模型的快速版本")
    print("• 如需更高準確度，可改用 'base' 或 'small' 模型")
    print("• 發言人標註需要手動添加\n")
