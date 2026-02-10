import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import type { Cotizacion, CotizacionPDFData } from '@/views/Administrador/Cotizaciones/Cotización.ts'

// Extender jsPDF con autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export class PDFGenerator {
  private doc: jsPDF
  private data: CotizacionPDFData
  private pageWidth: number
  private margin: number
  
  constructor(data: CotizacionPDFData) {
    this.data = data
    this.doc = new jsPDF('p', 'mm', 'letter')
    this.pageWidth = 210
    this.margin = 20
  }
  
  generate(): jsPDF {
    this.addHeader()
    this.addClienteInfo()
    this.addCotizacionInfo()
    this.addItemsTable()
    this.addTotals()
    this.addNotas()
    this.addTerminos()
    this.addFooter()
    
    return this.doc
  }
  
  private addHeader(): void {
    // Logo y nombre de la empresa
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('SENA', this.margin, this.margin + 10)
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Laboratorios Acreditados', this.margin, this.margin + 16)
    
    // Información de contacto
    const contactInfo = [
      this.data.empresaInfo.direccion,
      `📞 ${this.data.empresaInfo.telefono}`,
      `📧 ${this.data.empresaInfo.email}`
    ]
    
    contactInfo.forEach((line, index) => {
      this.doc.text(line, this.pageWidth - this.margin, this.margin + 10 + (index * 5), { align: 'right' })
    })
    
    // Línea divisoria
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.margin + 25, this.pageWidth - this.margin, this.margin + 25)
  }
  
  private addClienteInfo(): void {
    const startY = this.margin + 35
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('INFORMACIÓN DEL CLIENTE', this.margin, startY)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const clienteInfo = [
      `Nombre: ${this.data.cotizacion.cliente.nombre}`,
      `Empresa: ${this.data.cotizacion.cliente.empresa || 'N/A'}`,
      `Dirección: ${this.data.cotizacion.cliente.direccion}`,
      `Teléfono: ${this.data.cotizacion.cliente.telefono}`,
      `Email: ${this.data.cotizacion.cliente.email}`
    ]
    
    clienteInfo.forEach((line, index) => {
      this.doc.text(line, this.margin, startY + 10 + (index * 5))
    })
  }
  
  private addCotizacionInfo(): void {
    const startY = this.margin + 35
    const startX = this.pageWidth / 2
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('COTIZACIÓN', startX, startY, { align: 'center' })
    
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`COT-${this.data.cotizacion.id.toString().padStart(6, '0')}`, startX, startY + 10, { align: 'center' })
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const cotizacionInfo = [
      `Fecha: ${this.formatDate(this.data.cotizacion.fecha)}`,
      `Válida hasta: ${this.formatDate(this.data.cotizacion.vencimiento)}`,
      `Estado: ${this.getEstadoText(this.data.cotizacion.estado)}`,
      `Condiciones: ${this.data.cotizacion.condicionesPago || '30 días'}`
    ]
    
    cotizacionInfo.forEach((line, index) => {
      this.doc.text(line, startX, startY + 25 + (index * 5), { align: 'center' })
    })
  }
  
  private addItemsTable(): void {
    const startY = this.margin + 85
    
    // Encabezados de la tabla
    const headers = [
      ['Servicio', 'Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']
    ]
    
    // Datos de la tabla
    const body = this.data.cotizacion.items.map(item => [
      this.getServiceName(item.servicioId),
      item.descripcion || '-',
      item.cantidad.toString(),
      `$${this.formatCurrency(item.precioUnitario)}`,
      `$${this.formatCurrency(item.subtotal)}`
    ])
    
    this.doc.autoTable({
      startY,
      head: headers,
      body: body,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 158, 74],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 60 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 }
      }
    })
  }
  
  private addTotals(): void {
    const tableEnd = (this.doc as any).lastAutoTable.finalY || 150
    const startY = tableEnd + 10
    
    const totals = [
      { label: 'Subtotal:', value: this.data.cotizacion.subtotal },
      { label: `IVA (${this.data.config.iva * 100}%):`, value: this.data.cotizacion.iva },
      { label: 'Total:', value: this.data.cotizacion.total }
    ]
    
    totals.forEach((total, index) => {
      const y = startY + (index * 8)
      
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(total.label, this.pageWidth - this.margin - 70, y, { align: 'right' })
      
      this.doc.text(`$${this.formatCurrency(total.value)}`, this.pageWidth - this.margin, y, { align: 'right' })
      
      if (index === totals.length - 1) {
        // Línea sobre el total
        this.doc.setLineWidth(0.5)
        this.doc.line(this.pageWidth - this.margin - 70, y + 2, this.pageWidth - this.margin, y + 2)
      }
    })
  }
  
  private addNotas(): void {
    const startY = (this.doc as any).lastAutoTable.finalY + 50
    
    if (this.data.cotizacion.notas) {
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('NOTAS:', this.margin, startY)
      
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      
      const notasLines = this.doc.splitTextToSize(this.data.cotizacion.notas, 170)
      this.doc.text(notasLines, this.margin, startY + 7)
    }
  }
  
  private addTerminos(): void {
    const startY = (this.doc as any).lastAutoTable.finalY + 80
    
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('TÉRMINOS Y CONDICIONES:', this.margin, startY)
    
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    
    const terminos = this.data.cotizacion.terminos || this.data.config.terminosEstandar
    const terminosLines = this.doc.splitTextToSize(terminos, 170)
    this.doc.text(terminosLines, this.margin, startY + 7)
  }
  
  private addFooter(): void {
    const pageHeight = 297 // A4 height in mm
    const footerY = pageHeight - this.margin
    
    // Línea divisoria
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, footerY - 15, this.pageWidth - this.margin, footerY - 15)
    
    // Información del pie de página
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    const footerLeft = [
      'SENA Laboratorios Acreditados',
      `RFC: ${this.data.empresaInfo.rfc || 'XAXX010101000'}`,
      'www.senalaboratorios.com'
    ]
    
    const footerRight = [
      'Documento generado automáticamente',
      `Fecha de generación: ${new Date().toLocaleDateString('es-MX')}`,
      'Página 1 de 1'
    ]
    
    footerLeft.forEach((line, index) => {
      this.doc.text(line, this.margin, footerY - 10 + (index * 4))
    })
    
    footerRight.forEach((line, index) => {
      this.doc.text(line, this.pageWidth - this.margin, footerY - 10 + (index * 4), { align: 'right' })
    })
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  private formatCurrency(amount: number): string {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  
  private getEstadoText(estado: string): string {
    const estados: Record<string, string> = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      vencida: 'Vencida'
    }
    return estados[estado] || estado
  }
  
  private getServiceName(servicioId: number): string {
    // En producción, esto vendría de tu base de datos
    const servicios = [
      { id: 1, nombre: 'Análisis de Agua Potable' },
      { id: 2, nombre: 'Análisis Microbiológico' },
      { id: 3, nombre: 'Calibración de Balanzas' },
      { id: 4, nombre: 'Verificación de Termómetros' },
      { id: 5, nombre: 'Ensayo de Aptitud' },
      { id: 6, nombre: 'Análisis de Metales Pesados' }
    ]
    
    const servicio = servicios.find(s => s.id === servicioId)
    return servicio ? servicio.nombre : 'Servicio no especificado'
  }
}

// Función de conveniencia para generar y descargar PDF
export async function generateAndDownloadPDF(cotizacion: Cotizacion): Promise<void> {
  const pdfData: CotizacionPDFData = {
    cotizacion,
    empresaInfo: {
      nombre: 'SENA Laboratorios',
      direccion: 'Av. Tecnológico 123, Ciudad de México',
      telefono: '+52 (55) 1234-5678',
      email: 'info@senalaboratorios.com',
      rfc: 'SENA010101XXX'
    },
    config: {
      iva: 0.16,
      moneda: 'MXN',
      terminosEstandar: 'Esta cotización es válida por 30 días naturales. Los precios incluyen IVA. El pago debe realizarse dentro de los términos acordados. Los servicios se realizan bajo los estándares de calidad ISO/IEC 17043:2010.'
    }
  }
  
  const generator = new PDFGenerator(pdfData)
  const pdf = generator.generate()
  
  // Descargar el PDF
  pdf.save(`COT-${cotizacion.id.toString().padStart(6, '0')}.pdf`)
}