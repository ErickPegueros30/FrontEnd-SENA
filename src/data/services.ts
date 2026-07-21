/**
 * Catálogo de ensayos de aptitud que se muestra en la sección de servicios.
 *
 * Estaba duplicado literalmente en HomeView.vue, Nosotros.vue y
 * Servicios/Ensayos.vue. Las tres copias eran idénticas salvo el prefijo de
 * la ruta de los iconos ('../image/...' o '../../image/...'), que dependía de
 * dónde estuviera el archivo. Centralizándolo, el problema desaparece.
 */

export interface Service {
  id: number
  name: string
  /** icono para tema claro */
  icon: string
  /** icono para tema oscuro; si falta se reutiliza `icon` */
  iconWhite?: string
  route?: string
}

const black = (file: string) =>
  new URL(`../image/icons/Servicios/Black/${file}`, import.meta.url).href
const white = (file: string) =>
  new URL(`../image/icons/Servicios/White/${file}`, import.meta.url).href

export const servicesRow1: Service[] = [
  { id: 1, name: 'Agua', icon: black('Agua.svg'), iconWhite: white('Agua-White.svg'), route: '/servicios/agua' },
  { id: 2, name: 'Alimentos', icon: black('Alimentos.svg'), iconWhite: white('Alimentos-White.svg'), route: '/servicios/alimentos' },
  { id: 3, name: 'Masa', icon: black('Masa.svg'), iconWhite: white('Masa-White.svg'), route: '/servicios/masa' },
  { id: 4, name: 'Temperatura', icon: black('Temperatura.svg'), iconWhite: white('Temperatura-White.svg'), route: '/servicios/temperatura' },
  { id: 5, name: 'Presión', icon: black('Presion.svg'), iconWhite: white('Presion-White.svg'), route: '/servicios/presion' },
  { id: 6, name: 'Volumen', icon: black('Volumen.svg'), iconWhite: white('Volumen-White.svg'), route: '/servicios/volumen' }
]

export const servicesRow2: Service[] = [
  { id: 7, name: 'Densidad', icon: black('Densidad.svg'), iconWhite: white('Densidad-White.svg'), route: '/servicios/densidad' },
  { id: 8, name: 'Eléctrica', icon: black('Electrica.svg'), iconWhite: white('Electrica-White.svg'), route: '/servicios/electrica' },
  { id: 9, name: 'Dimensional', icon: black('Dimensional.svg'), iconWhite: white('Dimensional-White.svg'), route: '/servicios/dimensional' },
  { id: 10, name: 'Humedad', icon: black('Humedad.svg'), iconWhite: white('Humedad-White.svg'), route: '/servicios/humedad' },
  { id: 11, name: 'Flujo', icon: black('Flujos.svg'), iconWhite: white('Flujos-White.svg'), route: '/servicios/flujo' },
  { id: 12, name: 'Mediciones Especiales', icon: black('Especiales.svg'), iconWhite: white('Especiales-White.svg'), route: '/servicios/mediciones-especiales' }
]

/** Todas las filas, en el orden en que se muestran. */
export const serviceRows: Service[][] = [servicesRow1, servicesRow2]

/** Lista plana, útil para búsquedas por id. */
export const allServices: Service[] = [...servicesRow1, ...servicesRow2]
