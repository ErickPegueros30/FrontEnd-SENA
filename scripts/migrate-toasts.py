"""
Migra las implementaciones duplicadas de toast a <BaseToast> + useToast().

Solo actúa sobre archivos cuyo markup y lógica coinciden con el patrón
canónico. Cualquier archivo que se desvíe se reporta y se deja intacto.

Uso: python3 scripts/migrate-toasts.py [--apply]
"""
import re, sys, glob, os

APPLY = '--apply' in sys.argv

MARKUP = re.compile(
    r'[ \t]*<div class="toast-container position-fixed (?P<pos>[\w\- ]*?) p-3">'
    r'[\s\S]*?<div\s+id="(?P<id>\w+)"[\s\S]*?</div>\s*</div>\s*</div>\s*</div>\s*\n'
)

POS_MAP = {'top-0 end-0': 'top-end', 'bottom-0 end-0': 'bottom-end',
           'top-0 start-0': 'top-start', 'bottom-0 start-0': 'bottom-start'}

# declaraciones a eliminar del <script setup>
DECLS = ['const toastMessage', 'const toastTitle', 'const toastType', 'const toastEl',
         'let toastInstance', 'const showToast', 'const toastClass',
         'const toastIcon', 'const toastBodyIcon']


def remove_statement(src, start_kw):
    """Elimina la sentencia completa que empieza por start_kw, respetando el
    balanceo de llaves y paréntesis. Devuelve (src, ok)."""
    i = src.find('\n' + start_kw)
    if i == -1:
        return src, False
    i += 1
    j = i
    depth = 0
    started = False
    while j < len(src):
        ch = src[j]
        if ch in '({[':
            depth += 1
            started = True
        elif ch in ')}]':
            depth -= 1
        elif ch == '\n' and started and depth == 0:
            break
        elif ch == '\n' and not started:
            break  # sentencia de una línea sin paréntesis
        j += 1
    end = src.find('\n', j) + 1 if j < len(src) else len(src)
    return src[:i] + src[end:], True


targets, skipped = [], []
for f in sorted(p for p in glob.glob('src/**/*.vue', recursive=True) if os.path.isfile(p)):
    s = open(f, encoding='utf-8').read()
    m = MARKUP.search(s)
    if not m:
        continue
    if 'const showToast' not in s or 'toastBodyIcon' not in s:
        skipped.append((f, 'lógica no canónica'))
        continue
    if POS_MAP.get(m.group('pos').strip()) is None:
        skipped.append((f, f"posición desconocida: {m.group('pos')}"))
        continue
    targets.append((f, m))

print(f"Candidatos: {len(targets)} | Omitidos: {len(skipped)}")
for f, why in skipped:
    print(f"  OMITIDO {f}: {why}")

if not APPLY:
    for f, m in targets:
        print(f"  -> {f}  (id={m.group('id')}, pos={POS_MAP[m.group('pos').strip()]})")
    print("\n(dry-run)")
    sys.exit(0)

migrated = 0
for f, m in targets:
    s = open(f, encoding='utf-8').read()
    m = MARKUP.search(s)
    toast_id, pos = m.group('id'), POS_MAP[m.group('pos').strip()]
    indent = re.match(r'[ \t]*', m.group(0)).group(0)

    # 1) markup -> <BaseToast>
    s = s[:m.start()] + f'{indent}<BaseToast ref="toastRef" toast-id="{toast_id}" position="{pos}" />\n' + s[m.end():]

    # 2) eliminar la lógica local
    ok = True
    for kw in DECLS:
        s, done = remove_statement(s, kw)
        if not done and kw != 'let toastInstance':
            ok = False
    if not ok:
        print(f"  ! {f}: no se pudo limpiar toda la lógica, se deja intacto")
        continue

    # 3) imports + wiring
    s = re.sub(r"^import type \{ Toast \} from 'bootstrap'\n", '', s, flags=re.M)
    s = re.sub(r"^type ToastType = .*\n", '', s, flags=re.M)
    anchor = re.search(r"^import .*\n(?![\s\S]*?^import )", s, re.M)
    ins = ("import BaseToast from '@/components/UI/BaseToast.vue'\n"
           "import { useToast, type ToastType } from '@/composables/useToast'\n")
    s = s[:anchor.end()] + ins + s[anchor.end():] if anchor else s
    anchor2 = s.index('\n', s.index(ins) + len(ins))
    s = s[:anchor2 + 1] + "\nconst { toastRef, showToast } = useToast()\n" + s[anchor2 + 1:]

    open(f, 'w', encoding='utf-8').write(s)
    migrated += 1

print(f"\nMigrados: {migrated}")
