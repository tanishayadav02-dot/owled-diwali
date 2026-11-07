"""Bundle the site into one HTML file (CSS + JS inlined) for hosting as a single page.
Usage: python3 tools/build-single.py OUT.html"""
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
css = (root / 'css/style.css').read_text()
html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + css + '\n</style>')
html = re.sub(r'<script src="([^"]+)"></script>', lambda m: '<script>\n' + (root / m.group(1)).read_text() + '\n</script>', html)
# the host adds its own doctype/html/head/body wrapper
html = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>\s*', '', html, flags=re.I)
html = re.sub(r'<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', '', html)
html = html.replace('</head>\n<body class="locked">', '<script>document.body ? document.body.classList.add("locked") : addEventListener("DOMContentLoaded", () => document.body.classList.add("locked"))</script>')
html = re.sub(r'</body>\s*</html>\s*$', '', html)
pathlib.Path(sys.argv[1]).write_text(html)
