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

// Abre la plantilla HTML pública, reemplaza marcadores y abre en nueva ventana para imprimir/guardar
export async function openTemplateAndPrint(cotizacion: any): Promise<void> {
  try {
    const resp = await fetch('/plantilla.html')
    if (!resp.ok) throw new Error('No se pudo cargar la plantilla')
    let tpl = await resp.text()

    const fmt = (n: number) => n != null ? Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'

    // Normalize cotizacion shape (backend may return flat snapshot)
    const cot: any = {
      id: cotizacion.id_cotizacion || cotizacion.id || cotizacion.ID || 0,
      fecha: cotizacion.fecha || cotizacion.created_at || new Date().toISOString(),
      cliente: cotizacion.cliente || {
        nombre: cotizacion.nombre_cliente || cotizacion.nombre || '',
        empresa: cotizacion.empresa || '',
        direccion: cotizacion.direccion || '',
        telefono: cotizacion.telefono || '',
        email: cotizacion.correo || ''
      },
      items: (cotizacion.items || []).map((it: any) => ({
        descripcion: it.descripcion_snapshot || it.descripcion || it.referencia || '',
        cantidad: it.cantidad || it.cantidad || 0,
        precioUnitario: it.precioUnitario || it.precio_unitario || it.precio_unitario || 0,
        subtotal: it.subtotal || it.subtotal || 0
      })),
      subtotal: cotizacion.subtotal || cotizacion.subtotal || 0,
      iva: cotizacion.iva || cotizacion.iva || 0,
      total: cotizacion.total || cotizacion.total || 0,
      notas: cotizacion.notas || ''
    }

    // reemplazar marcadores simples
    tpl = tpl.replace('{{COT_REF}}', `COT-${String(cot.id).toString().padStart(6, '0')}`)
    tpl = tpl.replace('{{COT_FECHA}}', new Date(cot.fecha).toLocaleDateString())
    tpl = tpl.replace('{{CLIENTE_NOMBRE}}', cot.cliente.nombre || '')
    tpl = tpl.replace('{{CLIENTE_EMPRESA}}', cot.cliente.empresa || '')
    tpl = tpl.replace('{{CLIENTE_DIRECCION}}', cot.cliente.direccion || '')
    tpl = tpl.replace('{{CLIENTE_TELEFONO}}', cot.cliente.telefono || '')
    tpl = tpl.replace('{{CLIENTE_EMAIL}}', cot.cliente.email || '')

    // items
    const itemsHtml = cot.items.map((it: any) => `
      <tr>
        <td>${escapeHtml(it.descripcion || '')}</td>
        <td>${escapeHtml(it.descripcion || '')}</td>
        <td class="right">${escapeHtml(String(it.cantidad || 0))}</td>
        <td class="right">$${fmt(it.precioUnitario)}</td>
        <td class="right">$${fmt(it.subtotal)}</td>
      </tr>
    `).join('\n')

    tpl = tpl.replace('{{ITEMS_TABLE}}', itemsHtml)
    tpl = tpl.replace('{{SUBTOTAL}}', `$${fmt(cot.subtotal)}`)
    tpl = tpl.replace('{{IVA}}', `$${fmt(cot.iva)}`)
    tpl = tpl.replace('{{TOTAL}}', `$${fmt(cot.total)}`)
    tpl = tpl.replace('{{NOTAS}}', escapeHtml(cot.notas || ''))

    const w = window.open('', '_blank')
    if (!w) throw new Error('No se pudo abrir ventana nueva (bloqueador?)')
    w.document.open()
    w.document.write(tpl)
    w.document.close()

    // esperar a que cargue, rellenar via DOM como respaldo, y forzar print
    w.onload = () => {
      try {
        // intento rellenar campos concretos por ID/clase si existen
        try {
          const datos = w.document.getElementById('datos-cliente-principal')
          if (datos) {
            const nombreEl = datos.querySelector('.linea-cliente')
            if (nombreEl) nombreEl.textContent = String(cot.cliente.nombre || '')
            const empresaEl = datos.querySelector('.empresa-cliente')
            if (empresaEl) empresaEl.textContent = String(cot.cliente.empresa || '')
            const direccionEl = datos.querySelector('.direccion-cliente')
            if (direccionEl) direccionEl.textContent = String(cot.cliente.direccion || '')
            const telefonoEl = datos.querySelector('.telefono-cliente')
            if (telefonoEl) telefonoEl.textContent = String(cot.cliente.telefono || '')
            const emailEl = datos.querySelector('.email-cliente')
            if (emailEl) emailEl.textContent = String(cot.cliente.email || '')
          }

          // tabla de items (si existe tbody en #tabla-principal)
          const tbody = w.document.querySelector('#tabla-principal tbody') || w.document.querySelector('table.tabla-pdf tbody')
          if (tbody) {
            tbody.innerHTML = cot.items.map((it: any) => `
              <tr>
                <td>${escapeHtml(it.descripcion || '')}</td>
                <td>${escapeHtml(it.descripcion || '')}</td>
                <td class="td-cantidad">${Number(it.cantidad || 0)}</td>
                <td class="td-importe">$${fmt(it.precioUnitario)}</td>
                <td class="td-importe">$${fmt(it.subtotal)}</td>
              </tr>`).join('')
          }

          // Totales: buscar placeholders o elementos con clase .td-valor
          const subtotalEl = w.document.querySelector('[data-total="subtotal"]') || w.document.querySelector('.subtotal-valor')
          if (subtotalEl) subtotalEl.textContent = `$${fmt(cot.subtotal)}`
          const ivaEl = w.document.querySelector('[data-total="iva"]') || w.document.querySelector('.iva-valor')
          if (ivaEl) ivaEl.textContent = `$${fmt(cot.iva)}`
          const totalEl = w.document.querySelector('[data-total="total"]') || w.document.querySelector('.td-valor:last-child')
          if (totalEl) totalEl.textContent = `$${fmt(cot.total)}`
        } catch (innerErr) {
          // ignore DOM fill errors, pero loguear
          console.warn('DOM fill fallback failed', innerErr)
        }

        w.focus();
        try { w.print() } catch (e) { /* noop */ }
      } catch (e) { console.warn('print fallback failed', e) }
    }
  } catch (err) {
    console.error('openTemplateAndPrint error', err)
    alert('Error generando vista de impresión: ' + (err && err.message))
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function openTemplateAndPrintDOM(cotizacion) {
  const resp = await fetch('/plantilla.html');
  const tpl = await resp.text();
  const w = window.open('', '_blank');
  w.document.open();
  w.document.write(tpl);
  w.document.close();
  w.onload = () => {
    // Llena campos por ID
    const datos = w.document.getElementById('datos-cliente-principal');
    if (datos) {
      const linea = datos.querySelector('.linea-cliente');
      if (linea) linea.textContent = String(cotizacion.cliente.nombre || '')
      // populate other fields similarly if present
      const empresaEl = datos.querySelector('.empresa-cliente');
      if (empresaEl) empresaEl.textContent = String(cotizacion.cliente.empresa || '')
    }
    // Rellenar tabla: buscar tbody dentro de #tabla-principal
    const tbody = w.document.querySelector('#tabla-principal tbody');
    if (tbody) {
      tbody.innerHTML = cotizacion.items.map(it =>
        `<tr>
          <td>${escapeHtml(it.servicio || '')}</td>
          <td>${escapeHtml(it.descripcion || '')}</td>
          <td class="td-cantidad">${Number(it.cantidad)}</td>
          <td class="td-importe">$${Number(it.precioUnitario).toFixed(2)}</td>
          <td class="td-importe">$${Number(it.subtotal).toFixed(2)}</td>
        </tr>`).join('');
    }
    // Totales
    const totalEl = w.document.querySelector('.td-valor:last-child');
    if (totalEl) totalEl.textContent = `$${Number(cotizacion.total || 0).toFixed(2)}`;
    // Forzar foco y abrir diálogo imprimir
    try { w.focus(); w.print(); } catch(e){ console.warn(e); }
  }
}
