from pathlib import Path
path = Path('temp_manifest.json')
if not path.exists():
    raise FileNotFoundError(path)
nums = []
with path.open('r', encoding='utf8') as f:
    for line in f:
        line = line.strip()
        if line:
            nums.append(int(line))
text = ''.join(chr(n) for n in nums)
Path('temp_manifest_decoded.json').write_text(text, encoding='utf8')
print(text[:2000])
