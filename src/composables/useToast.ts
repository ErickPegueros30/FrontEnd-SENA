import { ref } from 'vue'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

/**
 * Conecta una vista con su <BaseToast>.
 *
 * Devuelve la ref que hay que enlazar al componente y una función showToast
 * con la MISMA firma que las implementaciones locales que sustituye, de modo
 * que las llamadas existentes no necesitan cambiar:
 *
 *   const { toastRef, showToast } = useToast()
 *   showToast('Guardado', 'success', 'Listo')
 */
export function useToast() {
  const toastRef = ref<{ show: (m: string, t?: ToastType, title?: string) => void } | null>(null)

  const showToast = (message: string, type: ToastType = 'info', title: string = '') => {
    toastRef.value?.show(message, type, title)
  }

  return { toastRef, showToast }
}

export default useToast
