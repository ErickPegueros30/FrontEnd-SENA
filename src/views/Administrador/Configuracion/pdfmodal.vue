<!-- src/components/admin/PdfThumbnail.vue -->
<template>
  <div
    class="pdf-thumb"
    :style="{ height: (height || 150) + 'px' }"
    role="button"
    :title="title || 'Ver PDF'"
    @click="open"
  >
    <canvas ref="canvasEl" class="pdf-thumb-canvas" v-show="rendered"></canvas>

    <div v-if="!rendered" class="pdf-thumb-state">
      <i :class="failed ? 'bi bi-file-earmark-pdf-fill' : 'bi bi-file-earmark-pdf'"></i>
      <span v-if="!failed" class="pdf-thumb-loading">Generando…</span>
    </div>

    <div v-if="rendered" class="pdf-thumb-overlay"><i class="bi bi-zoom-in"></i></div>
  </div>

  <Teleport to="body">
    <div v-if="showModal" class="pdf-modal-backdrop" @click.self="close">
      <div class="pdf-modal">
        <div class="pdf-modal-head">
          <strong class="pdf-modal-title">{{ title || 'Documento PDF' }}</strong>
          <div class="pdf-modal-actions">
            <a :href="modalSrc" target="_blank" rel="noopener" class="pdf-modal-btn" title="Abrir en pestaña">
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
            <button class="pdf-modal-btn" @click="close" title="Cerrar">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <iframe :src="modalSrc" class="pdf-modal-frame" title="PDF"></iframe>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useApiBase } from '@/composables/useApiBase'
import * as pdfjsLib from 'pdfjs-dist'
// Vite resuelve el worker del propio paquete (versión siempre alineada).
// Si usas pdfjs-dist v3, cambia .mjs por .js
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker

const props = defineProps<{
  src: string          // URL remota, blob: o data: del PDF
  title?: string
  height?: number      // alto de la miniatura en px (default 150)
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const rendered = ref(false)
const failed = ref(false)
const showModal = ref(false)
let renderTask: { cancel?: () => void; promise: Promise<unknown> } | null = null

const { api } = useApiBase()
const uploadsBase = () => {
  const raw = api.value || ''
  return raw.endsWith('/api') ? raw.slice(0, -4) : raw
}

const normalizeSrc = (s: any) => {
  if (s == null) return ''
  // If an object is passed, try common fields
  if (typeof s === 'object') {
    if (s.url) s = s.url
    else if (s.src) s = s.src
    else if (s.fileUrl) s = s.fileUrl
    else s = String(s)
  }
  const str = String(s).trim()
  if (!str) return ''
  // data: or blob: are valid for pdfjs
  if (str.startsWith('data:') || str.startsWith('blob:')) return str
  // If it's a root-relative path, prefer uploads base (backend) if available
  if (str.startsWith('/')) {
    const base = uploadsBase()
    return (base ? base : window.location.origin) + str
  }
  // If it's an absolute URL, but the path contains /uploads/, prefer backend uploads base
  try {
    const parsed = new URL(str)
    if (parsed.pathname && parsed.pathname.includes('/uploads/')) {
      const base = uploadsBase()
      return (base ? base : window.location.origin) + parsed.pathname
    }
  } catch (e) {
    // not a full URL, fallthrough
  }
  // If it's missing protocol but looks like a path containing /uploads/, prefer uploads base
  if (!/^[a-zA-Z]+:/.test(str) && str.includes('/uploads/')) {
    const base = uploadsBase()
    return (base ? base : window.location.origin) + (str.startsWith('/') ? str : '/' + str)
  }
  return str
}

const renderThumb = async () => {
  rendered.value = false
  failed.value = false
  const src = normalizeSrc(props.src)
  if (!src || !canvasEl.value) return
  console.debug('PdfThumbnail render attempt', { raw: props.src, src, typeOfRaw: typeof props.src })
  if (typeof src !== 'string' || !src) {
    failed.value = true
    return
  }
    try {
      // Try to fetch the raw PDF bytes first so we can detect HTML/404 responses
      let pdf
      try {
        let resp = await fetch(src)
        let contentType = resp.headers.get('content-type') || ''
        console.debug('PdfThumbnail fetch response', { src, ok: resp.ok, status: resp.status, contentType })

        // If the initial fetch failed (404/5xx), try the backend uploads base as alternative
        if (!resp.ok) {
          const base = uploadsBase()
          try {
            if (base) {
              const path = src.replace(window.location.origin, '')
              const alt = base + path
              console.debug('PdfThumbnail fetch original failed, trying backend uploads base', { src, alt })
              const resp2 = await fetch(alt)
              if (resp2.ok) {
                resp = resp2
                contentType = resp2.headers.get('content-type') || ''
              } else {
                throw new Error(`HTTP ${resp.status}`)
              }
            } else {
              throw new Error(`HTTP ${resp.status}`)
            }
          } catch (altErr) {
            console.warn('PdfThumbnail alternative fetch failed', altErr)
            throw altErr
          }
        }

        const arr = await resp.arrayBuffer()
        // Detect PDF magic header (%PDF) to avoid passing HTML or other responses
        const bytes = new Uint8Array(arr)
        const isPdf = bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
        console.debug('PdfThumbnail fetch bytes check', { src, isPdf, length: bytes.length })
        if (!isPdf) {
          // If we have an uploadsBase, try fetching from backend origin as a fallback (covers proxied/hosted uploads)
          const base = uploadsBase()
          const path = src.replace(window.location.origin, '')
          if (base && base !== window.location.origin) {
            try {
              const alt = base + path
              console.debug('PdfThumbnail trying backend uploads base for non-PDF response', { alt })
              const resp2 = await fetch(alt)
              if (resp2.ok) {
                const arr2 = await resp2.arrayBuffer()
                const bytes2 = new Uint8Array(arr2)
                const isPdf2 = bytes2.length >= 4 && bytes2[0] === 0x25 && bytes2[1] === 0x50 && bytes2[2] === 0x44 && bytes2[3] === 0x46
                console.debug('PdfThumbnail backend fetch check', { alt, isPdf2, length: bytes2.length })
                if (isPdf2) {
                  pdf = await pdfjsLib.getDocument({ data: arr2 }).promise
                }
              }
            } catch (e2) {
              console.warn('PdfThumbnail backend retry failed', e2)
            }
          }
        }
        if (!pdf) {
          // Prefer passing raw data to pdfjs to avoid worker fetching wrong origin content
          pdf = await pdfjsLib.getDocument({ data: arr }).promise
        }
      } catch (fetchErr) {
        // Fallback: let pdfjs attempt to load by URL if we couldn't retrieve bytes
        console.warn('PdfThumbnail fetch failed, falling back to pdfjs URL loader', fetchErr)
        pdf = await pdfjsLib.getDocument({ url: src }).promise
      }
    const page = await pdf.getPage(1)
    const canvas = canvasEl.value
    if (!canvas) return
    const targetH = props.height || 150
    const scale = targetH / page.getViewport({ scale: 1 }).height
    const viewport = page.getViewport({ scale })
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = viewport.width
    canvas.height = viewport.height
    renderTask = page.render({ canvasContext: ctx, viewport }) as typeof renderTask
    await renderTask!.promise
    rendered.value = true
  } catch (e) {
    console.error('PdfThumbnail render error', e, { raw: props.src, src })
    failed.value = true
  }
}

onMounted(renderThumb)
watch(() => props.src, renderThumb)

const modalSrc = ref('')
const open = () => {
  const src = normalizeSrc(props.src)
  if (!src) return
  modalSrc.value = src
  showModal.value = true
}
const close = () => { showModal.value = false; modalSrc.value = '' }

onBeforeUnmount(() => { try { renderTask?.cancel?.() } catch { /* noop */ } })
</script>

<style scoped>
.pdf-thumb {
  position: relative;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  border: 1px solid var(--sena-border);
}
.pdf-thumb-canvas { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdf-thumb-state {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  color: #b23b3b; font-size: 1.6rem;
}
.pdf-thumb-loading { font-size: 0.7rem; color: #888; }
.pdf-thumb-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.28); color: #fff; font-size: 1.4rem;
  opacity: 0; transition: opacity 0.2s ease;
}
.pdf-thumb:hover .pdf-thumb-overlay { opacity: 1; }

.pdf-modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 10001; padding: 1.5rem;
}
.pdf-modal {
  width: min(900px, 100%); height: min(90vh, 100%);
  background: #fff; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
.pdf-modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; border-bottom: 1px solid var(--sena-border);
}
.pdf-modal-title { font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pdf-modal-actions { display: flex; gap: 0.4rem; }
.pdf-modal-btn {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--sena-border);
  background: #fcfdfb; color: var(--sena-text); cursor: pointer;
  display: flex; align-items: center; justify-content: center; text-decoration: none;
}
.pdf-modal-btn:hover { background: var(--sena-green-pale); }
.pdf-modal-frame { flex: 1; width: 100%; border: 0; }
</style>
