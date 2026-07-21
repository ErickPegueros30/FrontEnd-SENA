"""Sustituye las refs locales de tema por useTheme(). Uso: --apply"""
import re, sys, glob, os
APPLY = '--apply' in sys.argv
LINE = "const currentTheme: Ref<Theme> = ref((localStorage.getItem('theme') as Theme) || 'light')"
done = skipped = 0
for f in sorted(p for p in glob.glob('src/**/*.vue', recursive=True) if os.path.isfile(p)):
    s = open(f, encoding='utf-8').read()
    if LINE not in s:
        continue
    new = s.replace(LINE, "const { currentTheme } = useTheme()")
    # el tipo Theme local deja de usarse si nadie mas lo referencia
    rest = new.replace("type Theme = 'light' | 'dark'", '')
    if not re.search(r'\bTheme\b', rest):
        new = new.replace("type Theme = 'light' | 'dark'\n", '')
    anchor = re.search(r"^import .*\n(?![\s\S]*?^import )", new, re.M)
    new = new[:anchor.end()] + "import { useTheme } from '@/composables/useTheme'\n" + new[anchor.end():]
    # limpiar 'Ref' del import de vue si ya no se usa
    body = new[new.index('<script'):]
    if len(re.findall(r'\bRef\b', body)) <= 1:
        new = re.sub(r",\s*type Ref\b", '', new, count=1)
    if APPLY:
        open(f, 'w', encoding='utf-8').write(new)
    done += 1
print(f"migrados: {done}")
