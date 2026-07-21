import { computed } from 'vue'
import useUiStore from './useUiStore'

export type Theme = 'light' | 'dark'

/**
 * Acceso al tema de la aplicación.
 *
 * Antes cada vista declaraba su propia `ref` leyendo localStorage, de modo
 * que un cambio de tema en un componente no se reflejaba en los demás.
 * Este composable delega en useUiStore, que ya era la fuente de verdad para
 * App.vue y el sidebar, de forma que todo queda sincronizado.
 *
 * `currentTheme` es un computed de lectura/escritura: sigue funcionando tanto
 * `:data-bs-theme="currentTheme"` en la plantilla como
 * `currentTheme.value = 'dark'` en el script.
 *
 * El valor inicial es el mismo que antes: localStorage('theme') || 'light'.
 */
export function useTheme() {
  const ui = useUiStore()

  const currentTheme = computed<Theme>({
    get: () => ui.state.theme as Theme,
    set: (value) => ui.setTheme(value)
  })

  const toggleTheme = () => ui.toggleTheme()

  /** Aplica el tema actual al <html>. Idempotente. */
  const applyTheme = () => {
    try {
      document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
    } catch {
      /* SSR / entorno sin DOM */
    }
  }

  return { currentTheme, toggleTheme, applyTheme }
}

export default useTheme
