"""
Migra a <BaseToast> las vistas cuyo toast quedó pendiente.

A diferencia del intento anterior, localiza el final del bloque contando la
anidación real de <div>/</div> en lugar de asumir un número fijo de cierres.

Uso: python3 scripts/migrate-toasts2.py [--apply]
"""
import re, sys

APPLY = '--apply' in sys.argv

FILES = [
    ("src/views/Administrador/Catalogos/AreasRamas.vue", "adminToast", "top-end"),
    ("src/views/Administrador/Cursos/admincursos.vue", "adminToast", "top-end"),
    ("src/views/Administrador/Event/EventosAdmin.vue", "adminToast", "top-end"),
    ("src/views/Administrador/Inscripciones/Inscripcion.vue", "adminToast", "top-end"),
    ("src/views/Cliente/CursosCatalogo.vue", "clientToast", "top-end"),
]

DECLS = ['const toastMessage', 'const toastTitle', 'const toastType', 'const toastEl',
         'let toastInstance', 'const showToast', 'const toastClass',
         'const toastIcon', 'const toastBodyIcon']

TAG = re.compile(r'<div\b|</div>')


def block_span(src, start):
    """Devuelve (inicio, fin) del <div> que empieza en `start`, respetando anidación."""
    depth = 0
    for m in TAG.finditer(src, start):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return start, m.end()
    raise ValueError('div sin cerrar')


def remove_statement(src, kw):
    i = src.find('\n' + kw)
    if i == -1:
        return src, False
    i += 1
    j, depth, started = i, 0, False
    while j < len(src):
        ch = src[j]
        if ch in '({[':
            depth += 1
            started = True
        elif ch in ')}]':
            depth -= 1
        elif ch == '\n' and (started and depth == 0 or not started):
            break
        j += 1
    end = src.find('\n', j) + 1 if j < len(src) else len(src)
    return src[:i] + src[end:], True


def balance(src):
    t = src[src.index('<template>'):src.index('</template>')]
    return len(re.findall(r'<div\b', t)) - len(re.findall(r'</div>', t))


for path, toast_id, pos in FILES:
    src = open(path, encoding='utf-8').read()
    before = balance(src)

    i = src.index('<div class="toast-container')
    line_start = src.rfind('\n', 0, i) + 1
    indent = src[line_start:i]
    s, e = block_span(src, i)
    # arrastrar el salto de línea final si el bloque ocupaba la línea completa
    while e < len(src) and src[e] in ' \t':
        e += 1
    if e < len(src) and src[e] == '\n':
        e += 1

    new = src[:line_start] + f'{indent}<BaseToast ref="toastRef" toast-id="{toast_id}" position="{pos}" />\n' + src[e:]

    ok = True
    for kw in DECLS:
        new, done = remove_statement(new, kw)
        if not done and kw != 'let toastInstance':
            ok = False
    if not ok:
        print(f"  ! {path}: lógica incompleta, se omite")
        continue

    new = re.sub(r"^import type \{ Toast \} from 'bootstrap'\n", '', new, flags=re.M)
    new = re.sub(r"^type ToastType = .*\n", '', new, flags=re.M)
    anchor = re.search(r"^import .*\n(?![\s\S]*?^import )", new, re.M)
    ins = ("import BaseToast from '@/components/UI/BaseToast.vue'\n"
           "import { useToast, type ToastType } from '@/composables/useToast'\n")
    new = new[:anchor.end()] + ins + "\nconst { toastRef, showToast } = useToast()\n" + new[anchor.end():]

    after = balance(new)
    status = 'OK ' if before == after else 'MAL'
    print(f"  {status} {path}  balance {before} -> {after}")
    if APPLY and before == after:
        open(path, 'w', encoding='utf-8').write(new)

print('\n(dry-run)' if not APPLY else '\nAplicado.')
