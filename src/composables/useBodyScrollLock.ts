/**
 * Bloqueo del scroll del fondo mientras hay modales abiertos.
 *
 * Usa un contador en lugar de un simple activar/desactivar porque con dos
 * modales abiertos a la vez, cerrar uno liberaba el scroll aunque el otro
 * siguiera visible.
 *
 * También limpia cualquier `style.overflow` en linea que hubiera quedado
 * puesto por las vistas antiguas: ese era justo el fallo que congelaba la
 * pagina en Acreditaciones al cerrar el visor de PDF.
 */
let locks = 0
let previousOverflow: string | null = null

export function lockBodyScroll() {
  if (typeof document === 'undefined') return
  if (locks === 0) {
    previousOverflow = document.body.style.overflow
    document.body.classList.add('app-modal-open')
  }
  locks++
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    document.body.classList.remove('app-modal-open')
    // Si alguien dejo un overflow en linea, se restaura al valor previo.
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = previousOverflow && previousOverflow !== 'hidden' ? previousOverflow : ''
    }
    previousOverflow = null
  }
}

/** Libera todos los bloqueos. Red de seguridad para cambios de ruta. */
export function releaseAllBodyScrollLocks() {
  locks = 0
  if (typeof document === 'undefined') return
  document.body.classList.remove('app-modal-open')
  if (document.body.style.overflow === 'hidden') document.body.style.overflow = ''
  previousOverflow = null
}
