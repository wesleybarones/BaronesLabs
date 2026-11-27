#!/usr/bin/env python3
"""Transcribe audio/video with faster-whisper; emit SRT, VTT, TXT and word-level JSON."""
import argparse, json, os
from faster_whisper import WhisperModel


def ts(t, sep=","):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{int(s):02}{sep}{int(round((s % 1) * 1000)):03}"


def chunk(words, max_chars):
    """Group words into subtitle cues no longer than max_chars."""
    cues, cur = [], []
    for w in words:
        text = " ".join(x["word"] for x in cur + [w])
        if cur and (len(text) > max_chars or w["start"] - cur[-1]["end"] > 0.8):
            cues.append(cur); cur = []
        cur.append(w)
        if w["word"].endswith((".", "?", "!")):
            cues.append(cur); cur = []
    if cur: cues.append(cur)
    return [{"start": c[0]["start"], "end": c[-1]["end"], "text": " ".join(x["word"] for x in c)} for c in cues]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("input"); p.add_argument("--model", default="small")
    p.add_argument("--language"); p.add_argument("--out", default=".")
    p.add_argument("--max-chars", type=int, default=42)
    a = p.parse_args()
    model = WhisperModel(a.model, device="auto", compute_type="auto")
    segs, info = model.transcribe(a.input, language=a.language, word_timestamps=True, vad_filter=True)
    words = [{"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "prob": round(w.probability, 3)}
             for s in segs for w in (s.words or [])]
    cues = chunk(words, a.max_chars)
    os.makedirs(a.out, exist_ok=True)
    base = os.path.join(a.out, os.path.splitext(os.path.basename(a.input))[0])
    with open(base + ".srt", "w") as f:
        for i, c in enumerate(cues, 1):
            f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n\n")
    with open(base + ".vtt", "w") as f:
        f.write("WEBVTT\n\n")
        for c in cues:
            f.write(f"{ts(c['start'], '.')} --> {ts(c['end'], '.')}\n{c['text']}\n\n")
    with open(base + ".txt", "w") as f:
        f.write(" ".join(w["word"] for w in words) + "\n")
    with open(base + ".words.json", "w") as f:
        json.dump({"language": info.language, "duration": info.duration, "words": words}, f, ensure_ascii=False, indent=1)
    print(f"language={info.language} words={len(words)} cues={len(cues)} -> {base}.[srt|vtt|txt|words.json]")


if __name__ == "__main__":
    main()
