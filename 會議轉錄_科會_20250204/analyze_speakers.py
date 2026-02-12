#!/usr/bin/env python3
"""
發言人分析與標註腳本
使用 AI 分析轉錄內容，識別並標註不同的發言人
"""
import re
from collections import defaultdict

def load_transcript(file_path):
    """載入轉錄檔案"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 提取分段轉錄部分
    segments_match = re.search(
        r'分段轉錄（含時間戳）\n={80}\n\n(.*)',
        content,
        re.DOTALL
    )

    if not segments_match:
        print("無法找到分段轉錄內容")
        return []

    segments_text = segments_match.group(1)

    # 解析每個時間段和對應文字
    pattern = r'\[(\d{2}:\d{2}:\d{2}) --> (\d{2}:\d{2}:\d{2})\]\n(.+?)(?=\n\[|\Z)'
    matches = re.findall(pattern, segments_text, re.DOTALL)

    segments = []
    for start, end, text in matches:
        text = text.strip()
        if text:
            segments.append({
                'start': start,
                'end': end,
                'text': text
            })

    return segments

def analyze_speaker_patterns(segments):
    """
    分析發言模式，識別可能的發言人

    識別規則：
    1. 報告技術細節的 → 技術人員
    2. 使用指導性語言的 → 主管
    3. 回應或確認的 → 其他參與者
    """
    speaker_segments = []
    current_speaker = None

    # 主管特徵詞
    manager_keywords = [
        '我跟你講', '大家要知道', '我覺得', '所以各位', '這一塊',
        '給大家', '送給', '鼓勵大家', '希望', '意思是說', '懂我意思',
        '你們要', '我們要', '重要的是', '加油', '努力', '團隊'
    ]

    # 技術人員特徵詞
    tech_keywords = [
        'API', '系統', 'Redis', 'Config', 'JVM', 'Bug', '優化',
        '監控', '測試', 'CICD', '上線', '部署', 'Case', '問題',
        '那個部分', '這邊的話', '目前', '預計', '我們做了'
    ]

    # 確認/回應特徵
    response_keywords = ['對', '好', 'OK', '是', '嗯', '了解', '沒問題']

    for i, seg in enumerate(segments):
        text = seg['text']

        # 判斷發言人類型
        is_manager = any(kw in text for kw in manager_keywords)
        is_tech = any(kw in text for kw in tech_keywords)
        is_response = len(text) < 10 and any(kw in text for kw in response_keywords)

        # 決定發言人
        if is_response:
            speaker = '參與者'
        elif is_manager and len(text) > 50:
            speaker = '主管'
        elif is_tech:
            speaker = '技術人員'
        else:
            # 繼承上一個發言人（同一個人連續說話）
            speaker = current_speaker if current_speaker else '發言人'

        # 如果是長段落，更可能是主要發言人
        if len(text) > 200:
            if '我們' in text and ('要' in text or '應該' in text):
                speaker = '主管'
            elif any(kw in text for kw in tech_keywords):
                speaker = '技術人員'

        speaker_segments.append({
            **seg,
            'speaker': speaker
        })

        current_speaker = speaker

    return speaker_segments

def refine_speakers(segments):
    """
    精煉發言人識別
    合併連續相同發言人的片段
    """
    refined = []
    i = 0

    while i < len(segments):
        current = segments[i]
        speaker = current['speaker']
        start = current['start']
        texts = [current['text']]

        # 查找連續的相同發言人
        j = i + 1
        while j < len(segments) and segments[j]['speaker'] == speaker:
            texts.append(segments[j]['text'])
            j += 1

        end = segments[j-1]['end'] if j > i + 1 else current['end']

        refined.append({
            'speaker': speaker,
            'start': start,
            'end': end,
            'text': '\n'.join(texts)
        })

        i = j

    return refined

def save_annotated_transcript(segments, output_file):
    """保存標註後的轉錄"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("會議轉錄（含發言人標註）\n")
        f.write("=" * 80 + "\n\n")

        f.write("說明：\n")
        f.write("- 主管：提供指導、激勵和方向性意見的發言人\n")
        f.write("- 技術人員：報告技術細節、系統狀況的發言人\n")
        f.write("- 參與者：簡短回應或確認的發言人\n\n")
        f.write("=" * 80 + "\n\n")

        for seg in segments:
            f.write(f"【{seg['speaker']}】[{seg['start']} --> {seg['end']}]\n")
            f.write(f"{seg['text']}\n\n")

    print(f"\n已保存標註後的轉錄至: {output_file}")

def generate_summary(segments):
    """生成發言統計"""
    speaker_stats = defaultdict(lambda: {'count': 0, 'total_text': 0})

    for seg in segments:
        speaker = seg['speaker']
        speaker_stats[speaker]['count'] += 1
        speaker_stats[speaker]['total_text'] += len(seg['text'])

    print("\n發言統計：")
    print("-" * 50)
    for speaker, stats in sorted(speaker_stats.items()):
        print(f"{speaker}：")
        print(f"  - 發言次數：{stats['count']} 次")
        print(f"  - 總字數：約 {stats['total_text']} 字")
    print("-" * 50)

if __name__ == "__main__":
    input_file = "/Users/chientinglee/Documents/Project/Demo1/科會_轉錄.txt"
    output_file = "/Users/chientinglee/Documents/Project/Demo1/科會_轉錄_標註版.txt"

    print("正在載入轉錄檔案...")
    segments = load_transcript(input_file)
    print(f"已載入 {len(segments)} 個時間段")

    print("\n正在分析發言人模式...")
    speaker_segments = analyze_speaker_patterns(segments)

    print("正在精煉發言人識別...")
    refined_segments = refine_speakers(speaker_segments)

    print(f"識別出 {len(refined_segments)} 個發言片段")
    generate_summary(refined_segments)

    print("\n正在保存標註後的轉錄...")
    save_annotated_transcript(refined_segments, output_file)

    print("\n✓ 完成！")
    print(f"\n查看標註結果：")
    print(f"  open {output_file}")
