/**
 * Consolida en src/styles/tokens.css las variables CSS declaradas en :root
 * dentro de los SFC, PERO solo aquellas cuyo valor es idéntico en todos los
 * archivos que la declaran. Las variables con valores divergentes se dejan
 * intactas en su archivo original para no alterar la cascada actual.
 *
 * Uso: node scripts/extract-tokens.mjs [--apply]
 */
import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'

const APPLY = process.argv.includes('--apply')

function walk(d, o = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p, o)
    else if (p.endsWith('.vue')) o.push(p)
  }
  return o
}

const files = walk('src')
const STYLE_RE = /<style([^>]*)>([\s\S]*?)<\/style>/g

// inventario: prop -> Map(valor -> [archivos])
const vars = new Map()
const order = []
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  for (const m of s.matchAll(STYLE_RE)) {
    let r
    try {
      r = postcss.parse(m[2])
    } catch {
      continue
    }
    r.walkRules((rule) => {
      if (!rule.selector.startsWith(':root')) return
      rule.walkDecls((d) => {
        if (!vars.has(d.prop)) {
          vars.set(d.prop, new Map())
          order.push(d.prop)
        }
        const bm = vars.get(d.prop)
        const v = d.value.trim()
        if (!bm.has(v)) bm.set(v, [])
        bm.get(v).push(f)
      })
    })
  }
}

const safe = order.filter((p) => vars.get(p).size === 1)
const conflicting = order.filter((p) => vars.get(p).size > 1)

console.log(`Variables totales: ${vars.size}`)
console.log(`Consolidables (valor único): ${safe.length}`)
console.log(`Con conflicto (se dejan en su archivo): ${conflicting.length} -> ${conflicting.join(', ')}`)

if (!APPLY) {
  console.log('\n(dry-run)')
  process.exit(0)
}

let out = `/* =============================================================
   tokens.css — design tokens del proyecto
   Consolidados desde los bloques :root duplicados en los SFC.
   Solo se movieron aquí las variables cuyo valor era idéntico en
   todos los archivos que las declaraban.
   ============================================================= */

:root {
`
for (const p of safe) out += `  ${p}: ${[...vars.get(p).keys()][0]};\n`
out += '}\n'
fs.mkdirSync('src/styles', { recursive: true })
fs.writeFileSync('src/styles/tokens.css', out)

// limpiar los SFC
const safeSet = new Set(safe)
let removed = 0
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  let newSrc = src
  for (const m of src.matchAll(STYLE_RE)) {
    let r
    try {
      r = postcss.parse(m[2])
    } catch {
      continue
    }
    let touched = false
    r.walkRules((rule) => {
      if (!rule.selector.startsWith(':root')) return
      rule.walkDecls((d) => {
        if (safeSet.has(d.prop)) {
          d.remove()
          removed++
          touched = true
        }
      })
      if (rule.nodes.length === 0) rule.remove()
    })
    if (touched) {
      const css = r.toString().replace(/\n{3,}/g, '\n\n')
      newSrc = newSrc.replace(m[0], `<style${m[1]}>${css}</style>`)
    }
  }
  if (newSrc !== src) fs.writeFileSync(f, newSrc)
}
console.log(`\nDeclaraciones eliminadas de los SFC: ${removed}`)
console.log(`Escrito: src/styles/tokens.css (${safe.length} variables)`)
