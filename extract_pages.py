from pypdf import PdfReader
path = r'D:\tema1\ministério_d_saude(Brasil)\Diabete Melito Tipo 1.pdf'
reader = PdfReader(path)
for i in [14, 15, 16, 17, 18, 27, 28, 29, 30]:
    if i <= len(reader.pages):
        print('---PAGE', i, '---')
        text = reader.pages[i - 1].extract_text() or ''
        print(text[:8000])
        print()
