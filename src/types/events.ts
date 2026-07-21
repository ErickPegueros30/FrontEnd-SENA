/**
 * Tipos del módulo de Eventos.
 *
 * Este archivo faltaba en el repositorio: seis componentes lo importaban
 * (`@/types/events`) y provocaban 6 errores TS2307 más los errores en
 * cascada de todo lo que dependía de estos tipos.
 *
 * Las formas están derivadas del mapeo real que hace `fetchEvents()` en
 * `views/eventos.vue` y de los campos que consumen las plantillas.
 */

/** Claves canónicas de estado usadas también en la vista de administración. */
export type EventStatus = 'proximo' | 'activo' | 'completado' | 'cancelado' | ''

export type EventModality = 'presential' | 'virtual' | 'hybrid' | string

export interface Speaker {
  id: number | string
  name: string
  title?: string
  /** iniciales o URL de imagen */
  avatar?: string
}

export interface Category {
  id: string
  name: string
  color?: string
  icon?: string
}

export interface Testimonial {
  id: number | string
  name: string
  company?: string
  text: string
  rating?: number
  date?: string
  avatar?: string
}

export interface Event {
  id: number | string
  title: string
  description: string
  shortDescription: string

  /** fechas: el backend puede enviar cualquiera de las tres */
  date: string
  startDate: string
  endDate: string
  /** rango horario ya formateado, p. ej. "09:00 - 13:00" */
  time: string

  modality: EventModality
  category: string
  location: string
  virtualLink: string | null

  price: number
  capacity: number
  registered: number

  featured: boolean
  status: EventStatus
  /** etiqueta legible del estado, calculada en la vista */
  statusLabel?: string
  /** usado por el filtro de búsqueda */
  matches?: boolean

  image: string
  speakers: Speaker[]
  tags: string[]
}

export interface EventFilters {
  category: string
  date: string
  modality: string
  sort: string
  search: string
}

export type ViewMode = 'grid' | 'list'
