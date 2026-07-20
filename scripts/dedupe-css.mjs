/**
 * Extractor de CSS duplicado (herramienta de refactorización, no forma parte del build).
 *
 * Analiza los bloques <style> de todos los SFC, detecta reglas IDÉNTICAS
 * (mismo contexto de at-rule + mismo selector + mismo cuerpo) repetidas en
 * N o más archivos, las mueve a una hoja global y las elimina de los SFC.
 *
 * Uso:  node scripts/dedupe-css.mjs --min=6 [--apply]
 *       (sin --apply solo reporta)
 */
import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'

const MIN = Number((process.argv.find((a) => a.startsWith('--min=')) || '--min=6').split('=')[1])
const APPLY = process.argv.includes('--apply')
const ROOT = 'src'

function walkVue(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walkVue(p, out)
    else if (e.isFile() && p.endsWith('.vue')) out.push(p)
  }
  return out
}

const files = walkVue(ROOT)
const STYLE_RE = /<style([^>]*)>([\s\S]*?)<\/style>/g

// --- contexto de at-rules de un nodo (ej: "@media (max-width: 768px)") ---
function ctxOf(node) {
  const chain = []
  let p = node.parent
  while (p && p.type === 'atrule') {
    chain.unshift(`@${p.name} ${p.params}`.trim())
    p = p.parent
  }
  return chain.join(' >> ')
}

function bodyOf(rule) {
  return rule.nodes
    .filter((n) => n.type === 'decl')
    .map((n) => `${n.prop}:${n.value.replace(/\s+/g, ' ').trim()}`)
    .join(';')
}

// ---------- PASADA 1: inventario ----------
const index = new Map() // key -> { ctx, selector, body, files:Set }
const selectorBodies = new Map() // "ctx|selector" -> Map(body -> Set(files))
const parsed = [] // { file, blocks:[{attrs, root, raw}] }

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const blocks = []
  for (const m of src.matchAll(STYLE_RE)) {
    let root
    try {
      root = postcss.parse(m[2], { from: file })
    } catch {
      continue // bloque con sintaxis no estándar: se deja intacto
    }
    blocks.push({ attrs: m[1], root, raw: m[0] })
    root.walkRules((rule) => {
      if (rule.selector.startsWith(':root')) return // los tokens se tratan aparte
      if (!rule.nodes || rule.nodes.some((n) => n.type === 'rule' || n.type === 'atrule')) return
      const ctx = ctxOf(rule)
      const sel = rule.selector.replace(/\s+/g, ' ').trim()
      const body = bodyOf(rule)
      if (!body) return
      const key = `${ctx}|${sel}|${body}`
      if (!index.has(key)) index.set(key, { ctx, sel, body, files: new Set(), order: index.size })
      index.get(key).files.add(file)

      const sk = `${ctx}|${sel}`
      if (!selectorBodies.has(sk)) selectorBodies.set(sk, new Map())
      const bm = selectorBodies.get(sk)
      if (!bm.has(body)) bm.set(body, new Set())
      bm.get(body).add(file)
    })
  }
  if (blocks.length) parsed.push({ file, blocks, src })
}

// ---------- selección ----------
const chosen = [...index.values()].filter((e) => e.files.size >= MIN)
chosen.sort((a, b) => a.order - b.order)
const chosenKeys = new Set(chosen.map((e) => `${e.ctx}|${e.sel}|${e.body}`))

// ---------- reporte de riesgo ----------
// Selectores extraídos que en OTROS archivos tienen un cuerpo distinto:
// esos archivos conservan su regla local (gana por especificidad de [data-v]),
// pero conviene revisarlos visualmente.
const risky = []
for (const e of chosen) {
  const bm = selectorBodies.get(`${e.ctx}|${e.sel}`)
  const others = [...bm.entries()].filter(([b]) => b !== e.body)
  if (others.length) {
    const affected = new Set()
    others.forEach(([, fs_]) => fs_.forEach((f) => affected.add(f)))
    risky.push({ sel: e.sel, ctx: e.ctx, variants: others.length, files: [...affected] })
  }
}

console.log(`Reglas únicas analizadas: ${index.size}`)
console.log(`Reglas repetidas en >=${MIN} archivos: ${chosen.length}`)
console.log(`Instancias que se eliminan de los SFC: ${chosen.reduce((a, e) => a + e.files.size, 0)}`)
console.log(`\nSelectores con variantes locales (revisar visualmente): ${risky.length}`)
for (const r of risky.slice(0, 25)) {
  console.log(`  ${r.sel}${r.ctx ? '  [' + r.ctx + ']' : ''} -> ${r.variants} variante(s) en ${r.files.length} archivo(s)`)
}

if (!APPLY) {
  console.log('\n(dry-run: ejecuta con --apply para escribir los cambios)')
  process.exit(0)
}

// ---------- PASADA 2: generar hoja global ----------
const base = chosen.filter((e) => !e.ctx)
const byCtx = new Map()
for (const e of chosen.filter((e) => e.ctx)) {
  if (!byCtx.has(e.ctx)) byCtx.set(e.ctx, [])
  byCtx.get(e.ctx).push(e)
}

let out = `/* =============================================================
   components.css — bloques de UI compartidos
   Generado a partir de reglas duplicadas en ${MIN}+ componentes.
   Los valores son EXACTAMENTE los que ya existían en los SFC.
   ============================================================= */\n\n`
for (const e of base) out += `${e.sel} {\n${e.body.split(';').map((d) => '  ' + d.replace(':', ': ') + ';').join('\n')}\n}\n\n`
for (const [ctx, list] of byCtx) {
  const opens = ctx.split(' >> ')
  out += opens.map((o, i) => '  '.repeat(i) + o + ' {').join('\n') + '\n'
  const ind = '  '.repeat(opens.length)
  for (const e of list) {
    out += `${ind}${e.sel} {\n${e.body.split(';').map((d) => ind + '  ' + d.replace(':', ': ') + ';').join('\n')}\n${ind}}\n`
  }
  out += opens.map((_, i) => '  '.repeat(opens.length - 1 - i) + '}').join('\n') + '\n\n'
}
fs.mkdirSync('src/styles', { recursive: true })
fs.writeFileSync('src/styles/components.css', out)

// ---------- PASADA 3: limpiar los SFC ----------
let removed = 0
for (const { file, blocks, src } of parsed) {
  let newSrc = src
  for (const b of blocks) {
    const root = b.root
    root.walkRules((rule) => {
      if (rule.selector.startsWith(':root')) return
      if (!rule.nodes || rule.nodes.some((n) => n.type === 'rule' || n.type === 'atrule')) return
      const key = `${ctxOf(rule)}|${rule.selector.replace(/\s+/g, ' ').trim()}|${bodyOf(rule)}`
      if (chosenKeys.has(key)) {
        rule.remove()
        removed++
      }
    })
    // limpiar at-rules que quedaron vacías
    let changedAt = true
    while (changedAt) {
      changedAt = false
      root.walkAtRules((at) => {
        if (at.nodes && at.nodes.length === 0) {
          at.remove()
          changedAt = true
        }
      })
    }
    const css = root.toString().replace(/\n{3,}/g, '\n\n')
    newSrc = newSrc.replace(b.raw, `<style${b.attrs}>${css}</style>`)
  }
  if (newSrc !== src) fs.writeFileSync(file, newSrc)
}
console.log(`\nReglas eliminadas de los SFC: ${removed}`)
console.log(`Hoja global escrita: src/styles/components.css (${out.split('\n').length} líneas)`)
