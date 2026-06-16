import re

with open('Portfolio.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).strip())
    content = content.replace(style_match.group(0), '<link rel="stylesheet" href="style.css">')

# Extract JS
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if script_match:
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(script_match.group(1).strip())
    content = content.replace(script_match.group(0), '<script src="script.js" defer></script>')

# Save Portfolio.html
with open('Portfolio.html', 'w', encoding='utf-8') as f:
    f.write(content)
