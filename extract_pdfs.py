import os, re
from pypdf import PdfReader

root = r'D:\tema1'
keywords = ['insulina','insulin','criança','crianca','tipo 1','diabetes','aplicar','aplicação','injeção','injetar','dose','basal','prandial']

for dirpath, _, filenames in os.walk(root):
    for filename in filenames:
        if not filename.lower().endswith('.pdf'):
            continue
        path = os.path.join(dirpath, filename)
        try:
            reader = PdfReader(path)
            text = '\n'.join(page.extract_text() or '' for page in reader.pages)
            lower = text.lower()
            if any(k in lower for k in keywords):
                print('FILE', path)
                for m in re.finditer(r'(.{0,260}(insulina|insulin|criança|crianca|tipo 1|diabetes|aplicar|aplicação|injeção|injetar|dose|basal|prandial).{0,260})', lower):
                    snippet = m.group(1).replace('\n', ' ')
                    if len(snippet) > 50:
                        print('...', snippet)
                        break
                print()
        except Exception as e:
            print('ERR', path, e)
