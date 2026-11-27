---
name: whisper
description: Transcribe audio/video locally with Whisper (faster-whisper), generate subtitles (SRT/VTT/word-level JSON) and cut video by audio (remove silences, trim to spoken segments). Use when the user asks to transcribe, caption/legendar, make subtitles, find what was said when, or cut/jump-cut a video by its audio. No API key needed.
---

# Whisper — transcrição, legenda e corte por áudio

Runs fully local via `faster-whisper` + `ffmpeg`. Scripts live in `scripts/` next to this file.

## Setup (once per machine)
```bash
pip install faster-whisper   # ffmpeg must be on PATH
```
Model weights download on first run (Hugging Face). Default model `small`; use `large-v3` for best quality, `base` for speed.

## 1. Transcribe + subtitles
```bash
python3 .claude/skills/whisper/scripts/transcribe.py INPUT [--model small] [--language pt] [--out DIR] [--max-chars 42]
```
Writes `<name>.srt`, `<name>.vtt`, `<name>.txt` and `<name>.words.json` (word-level timestamps — feed this to Remotion `remotion-captions` or HyperFrames for animated, word-synced captions).
- Pass `--language pt` for Portuguese; omit to auto-detect.
- `--max-chars` controls subtitle line length (42 = broadcast standard; ~20–28 for vertical/short-form).

## 2. Cut by audio (remove silences / jump cut)
```bash
python3 .claude/skills/whisper/scripts/cut_silence.py INPUT OUTPUT [--min-silence 0.5] [--threshold -35] [--pad 0.12]
```
Uses ffmpeg `silencedetect` to find gaps, keeps spoken segments (with `--pad` seconds of breathing room) and concatenates them. Re-run transcribe on the output to get subtitles that match the cut.

## 3. Cut to specific words/phrases
Read `<name>.words.json`, pick the start/end of the segments you want, then:
```bash
ffmpeg -ss START -to END -i INPUT -c:v libx264 -c:a aac clip.mp4
```

## Rules
- Always show the user the transcript before cutting by content — never guess what to remove.
- Keep originals; write outputs to new files.
- For captions burned into video, prefer Remotion/HyperFrames over ffmpeg `subtitles=` filter (better typography).
