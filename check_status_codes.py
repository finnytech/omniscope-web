import re
from pathlib import Path

file_path = Path("D:/projects/omniscope-web/_worker.js")
lines = file_path.read_text(encoding="utf-8").splitlines()

print(f"Total lines in _worker.js: {len(lines)}")

found_5xx = []
for idx, line in enumerate(lines, start=1):
    if re.search(r'(status:\s*5\d\d|status:\s*["\']5\d\d|,\s*5\d\d\s*[,\)])', line):
        found_5xx.append((idx, line.strip()))

print(f"\nRemaining 5xx status codes found: {len(found_5xx)}")
for idx, line in found_5xx:
    print(f"Line {idx}: {line}")
