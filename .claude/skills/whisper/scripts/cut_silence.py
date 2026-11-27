#!/usr/bin/env python3
"""Remove silences from a video/audio file using ffmpeg silencedetect, keeping spoken parts."""
import argparse, re, subprocess


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def main():
    p = argparse.ArgumentParser()
    p.add_argument("input"); p.add_argument("output")
    p.add_argument("--min-silence", type=float, default=0.5)
    p.add_argument("--threshold", type=float, default=-35, help="dB")
    p.add_argument("--pad", type=float, default=0.12)
    a = p.parse_args()
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.input, "-af",
                          f"silencedetect=noise={a.threshold}dB:d={a.min_silence}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    total = duration(a.input)
    keep, cur = [], 0.0
    for s, e in zip(starts, ends + [total] * (len(starts) - len(ends))):
        if s - cur > 0.05:
            keep.append((max(0, cur - a.pad), min(total, s + a.pad)))
        cur = e
    if total - cur > 0.05:
        keep.append((max(0, cur - a.pad), total))
    if not keep:
        raise SystemExit("No speech found — adjust --threshold")
    has_video = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=index",
                                "-of", "csv=p=0", a.input], capture_output=True, text=True).stdout.strip() != ""
    parts, labels = [], []
    for i, (s, e) in enumerate(keep):
        if has_video:
            parts.append(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}];")
            labels.append(f"[v{i}]")
        parts.append(f"[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS[a{i}];")
        labels.append(f"[a{i}]")
    n = len(keep)
    fc = "".join(parts) + "".join(labels) + f"concat=n={n}:v={1 if has_video else 0}:a=1" + ("[v][a]" if has_video else "[a]")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.input, "-filter_complex", fc]
    cmd += (["-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18"] if has_video else ["-map", "[a]"]) + ["-c:a", "aac", a.output]
    subprocess.run(cmd, check=True)
    kept = sum(e - s for s, e in keep)
    print(f"kept {n} segments, {kept:.1f}s of {total:.1f}s (removed {total - kept:.1f}s) -> {a.output}")


if __name__ == "__main__":
    main()
