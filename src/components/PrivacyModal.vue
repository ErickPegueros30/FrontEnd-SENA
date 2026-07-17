<template>
  <Teleport to="body">
    <div v-if="modelValue" class="privacy-modal-overlay" role="dialog" aria-modal="true" @click.self="close">
      <div class="privacy-modal-container" data-aos="zoom-in">
        <button class="modal-close" aria-label="Cerrar aviso" @click="close"><i class="bi bi-x-lg"></i></button>
        <div class="privacy-modal-body">
          <h2 class="modal-title">AVISO DE PRIVACIDAD</h2>

          <ol class="privacy-list">
            <li>
              <strong>IDENTIDAD DEL RESPONSABLE</strong>
              <p>SENA Ensayos de Aptitud, con domicilio en Senda Inmortal #24, Fracc. Milenio III, Santiago de Querétaro, Qro. C. P. 76060, es el responsable del tratamiento legal, confidencial y seguro de los datos personales recopilados de sus usuarios y laboratorios clientes participantes.</p>
            </li>

            <li>
              <strong>FINALIDAD DEL TRATAMIENTO</strong>
              <p>La información personal capturada a través de nuestros canales comerciales o digitales se empleará exclusivamente para los fines indispensables que dan soporte al servicio de evaluación de la aptitud contratado:</p>
              <ul>
                <li>Alta administrativa del laboratorio y control de accesos confidenciales en la plataforma digital.</li>
                <li>Gestión logística y distribución física controlada de los ítems de ensayo.</li>
                <li>Comunicación técnica directa para asesoría metodológica, soporte técnico y captura oficial de datos de medición.</li>
                <li>Emisión de Comprobantes Fiscales Digitales (CFDI), cobros y conciliaciones financieras.</li>
                <li>Evaluación de datos, emisión y distribución segura de los informes finales de desempeño y las constancias de participación oficiales.</li>
              </ul>
              <p>De forma accesoria (finalidad secundaria), utilizaremos sus datos de contacto para remitir invitaciones a nuevos programas de ensayos de aptitud, ofertas de capacitación especializada o evaluar el servicio mediante encuestas breves de satisfacción. Puede manifestar su negativa a estos fines secundarios remitiendo un correo electrónico a: <a href="mailto:sena@sena.mx">sena@sena.mx</a>.</p>
            </li>

            <li>
              <strong>DATOS PERSONALES UTILIZADOS</strong>
              <p>Para la consecución de los propósitos informados, recabaremos datos de contacto e identificación de su personal de enlace o representantes: nombre completo, puesto institucional, correo electrónico de la organización, teléfono técnico de contacto, datos de facturación (CFDI) y domicilios de entrega. No se solicitarán datos sensibles bajo ningún supuesto.</p>
            </li>

            <li>
              <strong>TRANSFERENCIAS DE DATOS</strong>
              <p>Sus datos personales no serán compartidos ni transferidos a organizaciones externas, salvo por requerimientos de autoridades federales o el uso indispensable de mensajería para el envío físico de los ítems de ensayo. Las actividades de evaluación técnica por parte de la Entidad Mexicana de Acreditación (ema) sobre los expedientes del SGC se ejecutan bajo codificación numérica anónima de los laboratorios (conforme a la norma ISO/IEC 17043), protegiendo en todo momento la identidad y confidencialidad del participante.</p>
            </li>

            <li>
              <strong>DERECHOS ARCO Y CONSULTA INTEGRAL</strong>
              <p>Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO), así como revocar el consentimiento, enviando su solicitud formal al Departamento de Privacidad a través de la cuenta de correo electrónico: <a href="mailto:direccion@sena.mx">direccion@sena.mx</a>.</p>
            </li>
          </ol>

          <div class="modal-actions">
            <button class="contact-btn" @click="close">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.privacy-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.privacy-modal-container {
  width: min(1000px, 96%);
  max-height: calc(100vh - 80px);
  overflow: auto;
  background: #0f180b;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 18px 60px rgba(0,0,0,0.6);
  color: #e8efe0;
  position: relative;
}
.modal-close {
  position: absolute;
  right: 12px;
  top: 12px;
  background: rgba(0,0,0,0.45);
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.privacy-modal-body { padding: 0.5rem 0; }
.modal-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-bottom: 0.75rem; color: #fff; }
.privacy-list { padding-left: 1.1rem; margin: 0; }
.privacy-list li { margin-bottom: 1rem; }
.privacy-list li p { margin: 0.25rem 0 0; color: rgba(255,255,255,0.9); }
.privacy-list ul { margin: 0.5rem 0 0 1.1rem; }
.modal-actions { display: flex; justify-content: center; margin-top: 1rem; }
.modal-actions .contact-btn { padding: 0.6rem 1.2rem; border-radius: 40px; }

@media (max-width: 640px) {
  .privacy-modal-container { padding: 1rem; }
  .modal-title { font-size: 1.25rem; }
}
</style>
