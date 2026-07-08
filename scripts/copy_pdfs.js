#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const SRC = path.join(process.cwd(), 'src', 'pdf')
const DEST = path.join(process.cwd(), 'public', 'pdf')

async function exists(p) {
  try { await fs.access(p); return true } catch { return false }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const e of entries) {
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.isDirectory()) await copyDir(s, d)
    else if (e.isFile()) await fs.copyFile(s, d)
  }
}

;(async () => {
  try {
    if (!await exists(SRC)) {
      console.log(`No hay carpeta fuente: ${SRC}. Nada que copiar.`)
      process.exit(0)
    }
    await copyDir(SRC, DEST)
    console.log(`Copiados PDFs: ${SRC} -> ${DEST}`)
  } catch (err) {
    console.error('Error copiando PDFs:', err)
    process.exit(2)
  }
})()
