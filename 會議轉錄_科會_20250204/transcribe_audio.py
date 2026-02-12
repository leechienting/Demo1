#!/usr/bin/env python3
"""
音訊轉錄腳本 - 使用 OpenAI Whisper
"""
import whisper
import sys
from pathlib import Path

def transcribe_audio(audio_file, model_size="base", language="zh"):
    """
    轉錄音訊檔案

    參數:
        audio_file: 音訊檔案路徑
        model_size: 模型大小 (tiny, base, small, medium, large)
                   - tiny: 最快，準確度較低
                   - base: 平衡速度與準確度（推薦）
                   - small: 較準確但較慢
                   - medium/large: 最準確但很慢
        language: 語言代碼 (zh=中文, en=英文)
    """
    print(f"正在載入 Whisper 模型 ({model_size})...")
    model = whisper.load_model(model_size)

    print(f"正在轉錄音訊: {audio_file}")
    print("這可能需要幾分鐘，請耐心等待...")

    # 轉錄音訊，verbose=True 會顯示進度
    result = model.transcribe(
        audio_file,
        language=language,
        verbose=True,
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

    print(f"\n轉錄完成！結果已保存至: {output_file}")

def format_timestamp(seconds):
    """將秒數轉換為 HH:MM:SS 格式"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

if __name__ == "__main__":
    # 設定檔案路徑
    audio_file = "/Users/chientinglee/Documents/Project/Demo1/科會.m4a"
    output_file = "/Users/chientinglee/Documents/Project/Demo1/科會_轉錄.txt"

    # 檢查檔案是否存在
    if not Path(audio_file).exists():
        print(f"錯誤：找不到音訊檔案 {audio_file}")
        sys.exit(1)

    # 執行轉錄（使用 base 模型，適合中文）
    result = transcribe_audio(audio_file, model_size="base", language="zh")

    # 保存結果
    save_transcription(result, output_file)

    print("\n提示：")
    print("1. 如果轉錄結果不夠準確，可以改用 'small' 或 'medium' 模型")
    print("2. 若要使用更大的模型，編輯此檔案將 model_size='base' 改為 'small' 或 'medium'")
    print("3. 發言人標註需要手動添加，或使用進階的 pyannote-audio 套件")
