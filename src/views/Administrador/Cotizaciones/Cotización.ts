export interface Cliente {
  id?: number
  nombre: string
  email: string
  telefono: string
  empresa?: string
  direccion: string
}

export interface CotizacionItem {
  id: number
  servicioId: number
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Cotizacion {
  id: number
  cliente: Cliente
  fecha: Date
  vencimiento: Date
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'vencida'
  condicionesPago?: string
  items: CotizacionItem[]
  subtotal: number
  iva: number
  total: number
  notas?: string
  terminos?: string
}

export interface Servicio {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  tiempoEntrega: string
}

export interface CotizacionPDFData {
  cotizacion: Cotizacion
  empresaInfo: {
    nombre: string
    direccion: string
    telefono: string
    email: string
    rfc?: string
    logo?: string
  }
  config: {
    iva: number
    moneda: string
    terminosEstandar: string
  }
}