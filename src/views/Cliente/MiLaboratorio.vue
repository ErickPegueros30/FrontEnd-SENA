<template>
  <div :data-bs-theme="currentTheme" class="mi-laboratorio">
    <!-- ============================================================
         Encabezado
         ============================================================ -->
    <header class="lab-header">
      <div class="container">
        <div class="header-row">
          <div>
            <span class="eyebrow">Portal del cliente</span>
            <h1 class="page-title">Mi laboratorio</h1>
            <p class="page-subtitle">
              Administra los datos de tu laboratorio, su facturación y el equipo que trabaja contigo.
            </p>
          </div>
          <button
            v-if="labs.length && !loading"
            type="button"
            class="btn btn-secondary"
            :disabled="loading"
            @click="load"
          >
            <span v-if="loading" class="spinner"></span>
            <i v-else class="bi bi-arrow-clockwise"></i>
            Actualizar
          </button>
        </div>
      </div>
    </header>

    <main class="lab-main">
      <div class="container">
        <!-- Cargando -->
        <div v-if="loading" class="cards-grid">
          <div v-for="n in 2" :key="`sk-${n}`" class="panel is-skeleton" aria-hidden="true">
            <div class="sk sk-line w-50"></div>
            <div class="sk sk-line w-75"></div>
            <div class="sk sk-block"></div>
          </div>
        </div>

        <!-- ============================================================
             Sin laboratorio: crear o unirse
             ============================================================ -->
        <div v-else-if="labs.length === 0" class="onboarding">
          <div class="empty-hero">
            <div class="empty-icon"><i class="bi bi-buildings"></i></div>
            <h2>Todavía no perteneces a un laboratorio</h2>
            <p>
              Crea el tuyo para inscribir ensayos y gestionar documentos, o únete a uno que ya exista.
              Todos los miembros de un laboratorio ven los mismos ensayos.
            </p>
          </div>

          <div class="onboarding-grid">
            <!-- Crear -->
            <form class="panel" @submit.prevent="createLab">
              <div class="panel-head">
                <div class="panel-icon"><i class="bi bi-plus-circle"></i></div>
                <div>
                  <h3 class="panel-title">Crear laboratorio</h3>
                  <p class="panel-sub">Serás su administrador</p>
                </div>
              </div>

              <div class="panel-body">
                <div class="field">
                  <label class="field-label" for="new-nombre">Nombre del laboratorio <span class="req">*</span></label>
                  <input
                    id="new-nombre"
                    v-model.trim="form.nombre"
                    class="field-input"
                    :class="{ 'is-invalid': createErrors.nombre }"
                    placeholder="Lab Metrología Norte"
                  />
                  <span v-if="createErrors.nombre" class="field-error">{{ createErrors.nombre }}</span>
                </div>

                <div class="field">
                  <label class="field-label" for="new-correo">Correo principal <span class="req">*</span></label>
                  <input
                    id="new-correo"
                    v-model.trim="form.correo_1"
                    type="email"
                    class="field-input"
                    :class="{ 'is-invalid': createErrors.correo_1 }"
                    placeholder="contacto@laboratorio.mx"
                  />
                  <span v-if="createErrors.correo_1" class="field-error">{{ createErrors.correo_1 }}</span>
                  <span v-else class="field-hint">Con este correo se identifica al laboratorio; no puede repetirse.</span>
                </div>

                <div class="field-row">
                  <div class="field">
                    <label class="field-label" for="new-tel">Teléfono técnico</label>
                    <input id="new-tel" v-model.trim="form.tel_tecnico" class="field-input" placeholder="442 123 4567" />
                  </div>
                  <div class="field">
                    <label class="field-label" for="new-municipio">Municipio</label>
                    <input id="new-municipio" v-model.trim="form.municipio" class="field-input" />
                  </div>
                </div>

                <div class="field">
                  <label class="field-label" for="new-estado">Estado</label>
                  <input id="new-estado" v-model.trim="form.estado" class="field-input" />
                </div>
              </div>

              <div class="panel-footer">
                <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
                  <span v-if="submitting" class="spinner"></span>
                  <i v-else class="bi bi-check2"></i>
                  {{ submitting ? 'Creando...' : 'Crear laboratorio' }}
                </button>
              </div>
            </form>

            <!-- Unirse -->
            <form class="panel" @submit.prevent="solicitarJoin">
              <div class="panel-head">
                <div class="panel-icon"><i class="bi bi-people"></i></div>
                <div>
                  <h3 class="panel-title">Unirme a uno existente</h3>
                  <p class="panel-sub">Un administrador deberá aprobarte</p>
                </div>
              </div>

              <div class="panel-body">
                <div class="field">
                  <label class="field-label" for="join-id">ID del laboratorio</label>
                  <input
                    id="join-id"
                    v-model="joinId"
                    class="field-input mono"
                    inputmode="numeric"
                    placeholder="Ej. 12"
                    :class="{ 'is-invalid': joinError }"
                    @input="joinError = ''"
                  />
                  <span v-if="joinError" class="field-error">{{ joinError }}</span>
                  <span v-else class="field-hint">Pídeselo a quien administra el laboratorio.</span>
                </div>

                <div class="info-box">
                  <i class="bi bi-info-circle"></i>
                  <span>Al aprobarte, verás todos los ensayos inscritos por el equipo.</span>
                </div>
              </div>

              <div class="panel-footer">
                <button type="submit" class="btn btn-secondary btn-block" :disabled="!joinId || joining">
                  <span v-if="joining" class="spinner"></span>
                  <i v-else class="bi bi-send"></i>
                  {{ joining ? 'Enviando...' : 'Solicitar unirme' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ============================================================
             Con laboratorio
             ============================================================ -->
        <div v-else class="lab-content">
          <section class="section">
            <div class="section-head">
              <div>
                <span class="eyebrow">Equipo</span>
                <h2 class="section-title">Tus laboratorios</h2>
              </div>
              <span class="count-pill">{{ labs.length }}</span>
            </div>

            <div class="cards-grid">
              <article v-for="l in labs" :key="l.laboratorio_id" class="lab-card">
                <header class="lab-card-head">
                  <div class="lab-avatar">{{ initials(l.nombre) }}</div>
                  <div class="lab-meta">
                    <h3 class="lab-name">{{ l.nombre }}</h3>
                    <span class="lab-id">ID {{ l.laboratorio_id }}</span>
                  </div>
                  <span class="role-pill" :class="`role-${roleKey(l.rol_equipo)}`">
                    <i :class="roleMeta(l.rol_equipo).icon"></i>
                    {{ roleMeta(l.rol_equipo).label }}
                  </span>
                </header>

                <dl class="lab-data">
                  <div>
                    <dt>Correo</dt>
                    <dd>{{ l.correo_1 || '—' }}</dd>
                  </div>
                  <div>
                    <dt>Teléfono</dt>
                    <dd>{{ l.tel_tecnico || l.tel_fijo || '—' }}</dd>
                  </div>
                  <div v-if="l.acreditado">
                    <dt>Acreditación</dt>
                    <dd>
                      <span class="acred-pill" :class="`ac-${l.acreditado}`">
                        {{ acreditadoLabel(l.acreditado) }}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div class="lab-actions">
                  <button class="btn btn-secondary btn-sm btn-grow" :disabled="opening === l.laboratorio_id" @click="viewLab(l)">
                    <span v-if="opening === l.laboratorio_id" class="spinner"></span>
                    <i v-else class="bi bi-pencil"></i>
                    {{ canEdit(l) ? 'Editar datos' : 'Ver datos' }}
                  </button>
                  <button
                    v-if="esSolicitudPendiente(l)"
                    class="btn btn-primary btn-sm"
                    :disabled="joining"
                    @click="solicitarAlLaboratorio(l.laboratorio_id)"
                  >
                    <i class="bi bi-send"></i> Reenviar solicitud
                  </button>
                </div>
              </article>
            </div>
          </section>

          <!-- Solicitudes pendientes (solo admin/técnico) -->
          <section v-if="isAdminOrTech" class="section">
            <div class="section-head">
              <div>
                <span class="eyebrow">Accesos</span>
                <h2 class="section-title">Solicitudes pendientes</h2>
                <p class="section-subtitle">Personas que quieren unirse a tu laboratorio</p>
              </div>
              <span class="count-pill">{{ solicitudes.length }}</span>
            </div>

            <div v-if="solicitudes.length === 0" class="empty-state">
              <i class="bi bi-inbox"></i>
              <h4>Sin solicitudes</h4>
              <p>Cuando alguien pida unirse a tu laboratorio, aparecerá aquí para que lo apruebes.</p>
            </div>

            <ul v-else class="request-list">
              <li v-for="s in solicitudes" :key="`${s.laboratorio_id}-${s.usuario_id}`" class="request-item">
                <div class="request-avatar">{{ initials(`${s.nombre || ''} ${s.primer_apellido || ''}`) }}</div>
                <div class="request-info">
                  <strong class="request-name">{{ s.nombre }} {{ s.primer_apellido }}</strong>
                  <span class="request-sub">
                    <i class="bi bi-person-badge"></i>{{ s.usuario_id }}
                    <span class="dot">·</span>
                    <i class="bi bi-building"></i>{{ labName(s.laboratorio_id) }}
                  </span>
                </div>
                <div class="request-actions">
                  <button
                    class="btn btn-primary btn-sm"
                    :disabled="acting === requestKey(s)"
                    @click="aprobar(s)"
                  >
                    <span v-if="acting === requestKey(s)" class="spinner"></span>
                    <i v-else class="bi bi-check2"></i> Aprobar
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    :disabled="acting === requestKey(s)"
                    @click="rechazar(s)"
                  >
                    <i class="bi bi-x-lg"></i> Rechazar
                  </button>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>

    <!-- ============================================================
         Modal: datos del laboratorio y facturación
         ============================================================ -->
    <Teleport to="body">
      <Transition name="ml-modal">
        <div
          v-if="showModal"
          class="ml-overlay"
          :data-bs-theme="currentTheme"
          @click.self="closeModal"
        >
          <div class="ml-modal" role="dialog" aria-modal="true" aria-labelledby="ml-modal-title">
            <div class="ml-modal-header">
              <div class="ml-modal-icon"><i class="bi bi-building-gear"></i></div>
              <div class="ml-modal-heading">
                <h5 id="ml-modal-title" class="ml-modal-title">{{ selectedLab?.nombre || 'Laboratorio' }}</h5>
                <p class="ml-modal-subtitle">ID {{ selectedLab?.laboratorio_id }}</p>
              </div>
              <button class="ml-modal-close" aria-label="Cerrar" :disabled="saving" @click="closeModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <nav class="ml-tabs" role="tablist">
              <button
                v-for="t in TABS"
                :key="t.key"
                type="button"
                role="tab"
                :aria-selected="activeTab === t.key"
                :class="{ active: activeTab === t.key }"
                @click="activeTab = t.key"
              >
                <i :class="t.icon"></i> {{ t.label }}
              </button>
            </nav>

            <div class="ml-modal-body">
              <div v-if="modalError" class="alert-inline" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>{{ modalError }}</span>
              </div>
              <p v-if="!canEdit(selectedLab)" class="readonly-note">
                <i class="bi bi-eye"></i> Solo lectura: necesitas rol de administrador o técnico para editar.
              </p>

              <!-- Pestaña: laboratorio -->
              <template v-if="activeTab === 'lab'">
                <section class="form-section">
                  <h6 class="form-section-title">Identificación</h6>
                  <div class="form-grid">
                    <div class="field span-2">
                      <label class="field-label" for="lab-nombre">Nombre <span class="req">*</span></label>
                      <input id="lab-nombre" v-model.trim="labForm.nombre" class="field-input" :class="{ 'is-invalid': labErrors.nombre }" :disabled="readOnly" />
                      <span v-if="labErrors.nombre" class="field-error">{{ labErrors.nombre }}</span>
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-correo1">Correo principal <span class="req">*</span></label>
                      <input id="lab-correo1" v-model.trim="labForm.correo_1" type="email" class="field-input" :class="{ 'is-invalid': labErrors.correo_1 }" :disabled="readOnly" />
                      <span v-if="labErrors.correo_1" class="field-error">{{ labErrors.correo_1 }}</span>
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-correo2">Correo alterno</label>
                      <input id="lab-correo2" v-model.trim="labForm.correo_2" type="email" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-tel-tec">Teléfono técnico</label>
                      <input id="lab-tel-tec" v-model.trim="labForm.tel_tecnico" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-tel-fijo">Teléfono fijo</label>
                      <input id="lab-tel-fijo" v-model.trim="labForm.tel_fijo" class="field-input" :disabled="readOnly" />
                    </div>
                  </div>
                </section>

                <section class="form-section">
                  <h6 class="form-section-title">Dirección</h6>
                  <div class="form-grid">
                    <div class="field span-2">
                      <label class="field-label" for="lab-calle">Calle</label>
                      <input id="lab-calle" v-model.trim="labForm.calle" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-ext">No. exterior</label>
                      <input id="lab-ext" v-model.trim="labForm.no_ext" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-int">No. interior</label>
                      <input id="lab-int" v-model.trim="labForm.no_int" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-colonia">Colonia</label>
                      <input id="lab-colonia" v-model.trim="labForm.colonia" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-cp">Código postal</label>
                      <input id="lab-cp" v-model.trim="labForm.cp" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-municipio">Municipio</label>
                      <input id="lab-municipio" v-model.trim="labForm.municipio" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-delegacion">Delegación</label>
                      <input id="lab-delegacion" v-model.trim="labForm.delegacion" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field span-2">
                      <label class="field-label" for="lab-estado">Estado</label>
                      <input id="lab-estado" v-model.trim="labForm.estado" class="field-input" :disabled="readOnly" />
                    </div>
                  </div>
                </section>

                <section class="form-section">
                  <h6 class="form-section-title">Operación y acreditación</h6>
                  <div class="form-grid">
                    <div class="field span-2">
                      <span class="field-label">Entrega de los ítems de ensayo</span>
                      <div class="segmented" role="radiogroup" aria-label="Entrega de elementos">
                        <button
                          v-for="opt in ENTREGA_OPTS"
                          :key="opt.value"
                          type="button"
                          role="radio"
                          :aria-checked="labForm.entrega_elementos === opt.value"
                          :class="{ active: labForm.entrega_elementos === opt.value }"
                          :disabled="readOnly"
                          @click="labForm.entrega_elementos = opt.value"
                        >
                          <i :class="opt.icon"></i> {{ opt.label }}
                        </button>
                      </div>
                    </div>

                    <div class="field span-2">
                      <span class="field-label">¿El laboratorio está acreditado?</span>
                      <div class="segmented" role="radiogroup" aria-label="Acreditación">
                        <button
                          v-for="opt in ACREDITADO_OPTS"
                          :key="opt.value"
                          type="button"
                          role="radio"
                          :aria-checked="labForm.acreditado === opt.value"
                          :class="{ active: labForm.acreditado === opt.value }"
                          :disabled="readOnly"
                          @click="labForm.acreditado = opt.value"
                        >
                          {{ opt.label }}
                        </button>
                      </div>
                    </div>

                    <template v-if="labForm.acreditado && labForm.acreditado !== 'no'">
                      <div class="field">
                        <label class="field-label" for="lab-espec">Especificación <span class="req">*</span></label>
                        <input
                          id="lab-espec"
                          v-model.trim="labForm.a_especificacion"
                          class="field-input"
                          :class="{ 'is-invalid': labErrors.a_especificacion }"
                          placeholder="ISO/IEC 17025:2017"
                          :disabled="readOnly"
                        />
                        <span v-if="labErrors.a_especificacion" class="field-error">{{ labErrors.a_especificacion }}</span>
                      </div>
                      <div class="field">
                        <label class="field-label" for="lab-numero">Número de acreditación <span class="req">*</span></label>
                        <input
                          id="lab-numero"
                          v-model.trim="labForm.a_numero"
                          class="field-input"
                          :class="{ 'is-invalid': labErrors.a_numero }"
                          :disabled="readOnly"
                        />
                        <span v-if="labErrors.a_numero" class="field-error">{{ labErrors.a_numero }}</span>
                      </div>
                    </template>
                  </div>
                </section>
              </template>

              <!-- Pestaña: facturación -->
              <template v-else>
                <section class="form-section">
                  <h6 class="form-section-title">Datos fiscales</h6>
                  <div class="form-grid">
                    <div class="field span-2">
                      <label class="field-label" for="fact-razon">Razón social <span class="req">*</span></label>
                      <input id="fact-razon" v-model.trim="factForm.razon_social" class="field-input" :class="{ 'is-invalid': factErrors.razon_social }" :disabled="readOnly" />
                      <span v-if="factErrors.razon_social" class="field-error">{{ factErrors.razon_social }}</span>
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-rfc">RFC <span class="req">*</span></label>
                      <input id="fact-rfc" v-model.trim="factForm.rfc" class="field-input mono" :class="{ 'is-invalid': factErrors.rfc }" maxlength="13" :disabled="readOnly" />
                      <span v-if="factErrors.rfc" class="field-error">{{ factErrors.rfc }}</span>
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-regimen">Régimen fiscal</label>
                      <input id="fact-regimen" v-model.trim="factForm.regimen_fiscal" class="field-input" :disabled="readOnly" />
                    </div>
                  </div>
                </section>

                <section class="form-section">
                  <h6 class="form-section-title">Domicilio fiscal</h6>
                  <div class="form-grid">
                    <div class="field span-2">
                      <label class="field-label" for="fact-calle">Calle</label>
                      <input id="fact-calle" v-model.trim="factForm.calle" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-ext">No. exterior</label>
                      <input id="fact-ext" v-model.trim="factForm.no_ext" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-int">No. interior</label>
                      <input id="fact-int" v-model.trim="factForm.no_int" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-colonia">Colonia</label>
                      <input id="fact-colonia" v-model.trim="factForm.colonia" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-cp">Código postal</label>
                      <input id="fact-cp" v-model.trim="factForm.cp" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-municipio">Municipio</label>
                      <input id="fact-municipio" v-model.trim="factForm.municipio" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-estado">Estado</label>
                      <input id="fact-estado" v-model.trim="factForm.estado" class="field-input" :disabled="readOnly" />
                    </div>
                  </div>
                </section>

                <section class="form-section">
                  <h6 class="form-section-title">Pago</h6>
                  <div class="form-grid">
                    <div class="field">
                      <label class="field-label" for="fact-cfdi">Uso del CFDI</label>
                      <input id="fact-cfdi" v-model.trim="factForm.cfdi" class="field-input" placeholder="G03" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-metodo">Método de pago</label>
                      <select id="fact-metodo" v-model="factForm.metodo_pago" class="field-input" :disabled="readOnly">
                        <option :value="null">Sin especificar</option>
                        <option value="PUE">PUE — Pago en una sola exhibición</option>
                        <option value="PPD">PPD — Pago en parcialidades o diferido</option>
                      </select>
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-forma">Forma de pago</label>
                      <input id="fact-forma" v-model.trim="factForm.forma_pago" class="field-input" placeholder="03" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-banco">Institución bancaria</label>
                      <input id="fact-banco" v-model.trim="factForm.institucion_bancaria" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field span-2">
                      <label class="field-label" for="fact-clabe">Cuenta o CLABE</label>
                      <input id="fact-clabe" v-model.trim="factForm.cuenta_clabe" class="field-input mono" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-correo">Correo de facturación</label>
                      <input id="fact-correo" v-model.trim="factForm.correo_1" type="email" class="field-input" :disabled="readOnly" />
                    </div>
                    <div class="field">
                      <label class="field-label" for="fact-tel">Teléfono</label>
                      <input id="fact-tel" v-model.trim="factForm.tel_tecnico" class="field-input" :disabled="readOnly" />
                    </div>
                  </div>
                </section>
              </template>
            </div>

            <div class="ml-modal-footer">
              <span class="footer-note"><span class="req">*</span> Campos obligatorios</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="saving" @click="closeModal">
                  {{ readOnly ? 'Cerrar' : 'Cancelar' }}
                </button>
                <button
                  v-if="!readOnly"
                  type="button"
                  class="btn btn-primary"
                  :disabled="saving"
                  @click="activeTab === 'lab' ? saveLab() : saveFacturacion()"
                >
                  <span v-if="saving" class="spinner"></span>
                  <i v-else class="bi bi-check2"></i>
                  {{ saving ? 'Guardando...' : (activeTab === 'lab' ? 'Guardar laboratorio' : 'Guardar facturación') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <BaseToast ref="toastRef" toast-id="miLaboratorioToast" position="top-end" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import useApiBase from '@/composables/useApiBase'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import BaseToast from '@/components/UI/BaseToast.vue'

/* ============================================================
   Tipos
   ============================================================ */
interface Laboratorio {
  laboratorio_id: number
  equipo_id?: number
  nombre: string
  rol_equipo?: string
  correo_1?: string
  correo_2?: string
  tel_tecnico?: string
  tel_fijo?: string
  calle?: string
  no_ext?: string
  no_int?: string
  colonia?: string
  municipio?: string
  delegacion?: string
  estado?: string
  cp?: string
  entrega_elementos?: string
  acreditado?: string
  a_especificacion?: string
  a_numero?: string
}

interface Solicitud {
  equipo_id?: number
  usuario_id: string
  laboratorio_id: number
  nombre?: string
  primer_apellido?: string
}

interface Meta { label: string; icon: string }

/* ============================================================
   Configuración
   ============================================================ */
const ROLES: Record<string, Meta> = {
  admin: { label: 'Administrador', icon: 'bi bi-shield-check' },
  tecnico: { label: 'Técnico', icon: 'bi bi-tools' },
  contacto: { label: 'Contacto', icon: 'bi bi-person-lines-fill' },
  miembro: { label: 'Miembro', icon: 'bi bi-person' },
  pendiente: { label: 'Solicitud pendiente', icon: 'bi bi-hourglass-split' }
}

// Roles que pueden editar los datos del laboratorio
const ROLES_EDITORES = ['admin', 'tecnico']
// Roles que indican una solicitud sin aprobar
const ROLES_PENDIENTES = ['pendiente', 'solicitante', 'solicitud']

const ACREDITADO_OPTS = [
  { value: 'no', label: 'No' },
  { value: 'si', label: 'Sí' },
  { value: 'en_proceso', label: 'En proceso' }
]

const ENTREGA_OPTS = [
  { value: 'instalaciones_sena', label: 'En instalaciones SENA', icon: 'bi bi-building' },
  { value: 'paqueteria', label: 'Vía paquetería', icon: 'bi bi-truck' }
]

const TABS = [
  { key: 'lab', label: 'Laboratorio', icon: 'bi bi-building' },
  { key: 'facturacion', label: 'Facturación', icon: 'bi bi-receipt' }
] as const

type TabKey = typeof TABS[number]['key']

/* ============================================================
   Estado
   ============================================================ */
const { api, authHeaders } = useApiBase()
const { currentTheme } = useTheme()
const { toastRef, showToast } = useToast()

const loading = ref(true)
const submitting = ref(false)
const joining = ref(false)
const saving = ref(false)
const opening = ref<number | null>(null)
const acting = ref<string | null>(null)

const labs = ref<Laboratorio[]>([])
const solicitudes = ref<Solicitud[]>([])
const joinId = ref('')
const joinError = ref('')

const form = reactive({ nombre: '', correo_1: '', tel_tecnico: '', calle: '', municipio: '', estado: '' })
const createErrors = reactive<Record<string, string>>({})

const showModal = ref(false)
const activeTab = ref<TabKey>('lab')
const selectedLab = ref<Laboratorio | null>(null)
const labForm = reactive<Record<string, any>>({})
const factForm = reactive<Record<string, any>>({})
const labErrors = reactive<Record<string, string>>({})
const factErrors = reactive<Record<string, string>>({})
const modalError = ref('')

/* ============================================================
   Utilidades
   ============================================================ */
const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...authHeaders() })

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

// Lee el cuerpo y lanza un error con el mensaje del servidor si la respuesta falla
const requestJson = async (url: string, init: RequestInit = {}) => {
  const resp = await fetch(url, init)
  const body = await resp.json().catch(() => ({}))
  if (resp.status === 401 || resp.status === 403) throw new Error('Tu sesión expiró o no tienes permiso para esta acción.')
  if (!resp.ok) throw new Error(body?.message || `No se pudo completar la operación (HTTP ${resp.status})`)
  return body
}

const clearErrors = (target: Record<string, string>) => {
  Object.keys(target).forEach(k => delete target[k])
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const initials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

const roleKey = (rol?: string) => {
  const r = String(rol || 'miembro').toLowerCase()
  if (ROLES_PENDIENTES.includes(r)) return 'pendiente'
  return ROLES[r] ? r : 'miembro'
}
const roleMeta = (rol?: string) => ROLES[roleKey(rol)] ?? ROLES.miembro

const acreditadoLabel = (v?: string) => ACREDITADO_OPTS.find(o => o.value === v)?.label ?? '—'

const canEdit = (l?: Laboratorio | null) => !!l && ROLES_EDITORES.includes(roleKey(l.rol_equipo))
const readOnly = computed(() => !canEdit(selectedLab.value))

const esSolicitudPendiente = (l: Laboratorio) => roleKey(l.rol_equipo) === 'pendiente'

const isAdminOrTech = computed(() => labs.value.some(l => canEdit(l)))

const labName = (id: number) => labs.value.find(l => l.laboratorio_id === id)?.nombre ?? `Lab ${id}`

const requestKey = (s: Solicitud) => `${s.laboratorio_id}-${s.usuario_id}`

/* ============================================================
   Carga
   ============================================================ */
const load = async () => {
  loading.value = true
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/mis`, { headers: { ...authHeaders() } })
    labs.value = body.data || []
    if (isAdminOrTech.value) await loadSolicitudes()
  } catch (err) {
    console.error('load labs error', err)
    showToast(errorMessage(err), 'error', 'No se pudo cargar')
  } finally {
    loading.value = false
  }
}

const loadSolicitudes = async () => {
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/solicitudes`, { headers: { ...authHeaders() } })
    solicitudes.value = body.data || []
  } catch (err) {
    console.error('load solicitudes error', err)
  }
}

/* ============================================================
   Crear laboratorio / solicitar acceso
   ============================================================ */
const validateCreate = () => {
  clearErrors(createErrors)
  if (!form.nombre) createErrors.nombre = 'El nombre es obligatorio'
  if (!form.correo_1) createErrors.correo_1 = 'El correo es obligatorio'
  else if (!isEmail(form.correo_1)) createErrors.correo_1 = 'Escribe un correo válido'
  return Object.keys(createErrors).length === 0
}

const createLab = async () => {
  if (submitting.value || !validateCreate()) return
  submitting.value = true
  try {
    await requestJson(`${api.value}/api/laboratorios`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ ...form })
    })
    Object.assign(form, { nombre: '', correo_1: '', tel_tecnico: '', calle: '', municipio: '', estado: '' })
    await load()
    showToast('Tu laboratorio quedó registrado', 'success', 'Laboratorio creado')
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo crear')
  } finally {
    submitting.value = false
  }
}

const solicitarJoin = async () => {
  const id = Number(String(joinId.value).trim())
  if (!id || Number.isNaN(id)) {
    joinError.value = 'Escribe el ID numérico del laboratorio'
    return
  }
  joining.value = true
  joinError.value = ''
  try {
    await requestJson(`${api.value}/api/laboratorios/solicitar`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ laboratorio_id: id })
    })
    joinId.value = ''
    await load()
    showToast('Un administrador del laboratorio revisará tu solicitud', 'success', 'Solicitud enviada')
  } catch (err) {
    joinError.value = errorMessage(err)
  } finally {
    joining.value = false
  }
}

const solicitarAlLaboratorio = async (id: number) => {
  joinId.value = String(id)
  await solicitarJoin()
}

/* ============================================================
   Solicitudes pendientes
   ============================================================ */
const resolverSolicitud = async (s: Solicitud, accion: 'approve' | 'reject') => {
  if (acting.value) return
  acting.value = requestKey(s)
  try {
    await requestJson(`${api.value}/api/laboratorios/solicitudes/${s.usuario_id}/${accion}`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ laboratorio_id: s.laboratorio_id })
    })
    solicitudes.value = solicitudes.value.filter(x => requestKey(x) !== requestKey(s))
    if (accion === 'approve') {
      showToast(`${s.nombre || 'El usuario'} ya forma parte del equipo`, 'success', 'Solicitud aprobada')
      await load()
    } else {
      showToast('La solicitud fue rechazada', 'success', 'Listo')
    }
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo completar')
  } finally {
    acting.value = null
  }
}

const aprobar = (s: Solicitud) => resolverSolicitud(s, 'approve')
const rechazar = (s: Solicitud) => resolverSolicitud(s, 'reject')

/* ============================================================
   Modal: ver / editar
   ============================================================ */
const viewLab = async (l: Laboratorio) => {
  if (opening.value) return
  opening.value = l.laboratorio_id
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/${l.laboratorio_id}`, {
      headers: { ...authHeaders() }
    })
    const data = body.data || {}
    // Se conserva el rol del listado: el detalle puede no traerlo
    selectedLab.value = { ...(data.laboratorio || l), rol_equipo: l.rol_equipo }
    clearErrors(labErrors)
    clearErrors(factErrors)
    modalError.value = ''
    Object.keys(labForm).forEach(k => delete labForm[k])
    Object.keys(factForm).forEach(k => delete factForm[k])
    Object.assign(labForm, data.laboratorio || {})
    Object.assign(factForm, data.facturacion || {})
    if (!labForm.acreditado) labForm.acreditado = 'no'
    if (!labForm.entrega_elementos) labForm.entrega_elementos = 'instalaciones_sena'
    activeTab.value = 'lab'
    showModal.value = true
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo abrir')
  } finally {
    opening.value = null
  }
}

const closeModal = () => {
  if (saving.value) return
  showModal.value = false
  selectedLab.value = null
}

const validateLab = () => {
  clearErrors(labErrors)
  if (!labForm.nombre) labErrors.nombre = 'El nombre es obligatorio'
  if (!labForm.correo_1) labErrors.correo_1 = 'El correo es obligatorio'
  else if (!isEmail(labForm.correo_1)) labErrors.correo_1 = 'Escribe un correo válido'
  // La base de datos rechaza acreditado <> 'no' sin especificación y número
  if (labForm.acreditado && labForm.acreditado !== 'no') {
    if (!labForm.a_especificacion) labErrors.a_especificacion = 'Requerido si el laboratorio está acreditado'
    if (!labForm.a_numero) labErrors.a_numero = 'Requerido si el laboratorio está acreditado'
  }
  return Object.keys(labErrors).length === 0
}

const saveLab = async () => {
  if (!selectedLab.value || saving.value) return
  if (!validateLab()) { modalError.value = 'Revisa los campos marcados.'; return }
  saving.value = true
  modalError.value = ''
  try {
    await requestJson(`${api.value}/api/laboratorios/${selectedLab.value.laboratorio_id}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(labForm)
    })
    await load()
    showToast('Los datos del laboratorio se guardaron', 'success', 'Guardado')
    closeModal()
  } catch (err) {
    modalError.value = errorMessage(err)
  } finally {
    saving.value = false
  }
}

const validateFacturacion = () => {
  clearErrors(factErrors)
  if (!factForm.razon_social) factErrors.razon_social = 'La razón social es obligatoria'
  if (!factForm.rfc) factErrors.rfc = 'El RFC es obligatorio'
  else if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i.test(String(factForm.rfc).trim())) {
    factErrors.rfc = 'El RFC no tiene un formato válido'
  }
  return Object.keys(factErrors).length === 0
}

const saveFacturacion = async () => {
  if (!selectedLab.value || saving.value) return
  if (!validateFacturacion()) { modalError.value = 'Revisa los campos marcados.'; return }
  saving.value = true
  modalError.value = ''
  try {
    await requestJson(`${api.value}/api/laboratorios/${selectedLab.value.laboratorio_id}/facturacion`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify({ ...factForm, rfc: String(factForm.rfc || '').toUpperCase() })
    })
    showToast('Los datos de facturación se guardaron', 'success', 'Guardado')
    closeModal()
  } catch (err) {
    modalError.value = errorMessage(err)
  } finally {
    saving.value = false
  }
}

/* ============================================================
   Comportamiento del modal
   ============================================================ */
watch(showModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showModal.value) closeModal()
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value)
  window.addEventListener('keydown', onKeydown)
  void load()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(currentTheme, (t) => {
  document.documentElement.setAttribute('data-bs-theme', t)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ============================================================
   TOKENS (también para el modal, que se teletransporta a <body>)
   ============================================================ */
.mi-laboratorio,
.ml-overlay {
  --sena-green: #5d8a2f;
  --sena-green-light: #7aab3d;
  --sena-green-pale: #edf4e3;
  --sena-text: #1c2b14;
  --sena-muted: #5a6a52;
  --sena-border: rgba(93, 138, 47, 0.14);

  --page-bg: #fafaf8;
  --surface: #ffffff;
  --surface-alt: #f6f9f2;

  --tone-ok: #1e7a3c;      --tone-ok-bg: rgba(25, 135, 84, 0.12);
  --tone-warn: #9a5b00;    --tone-warn-bg: rgba(255, 170, 0, 0.16);
  --tone-danger: #b42318;  --tone-danger-bg: rgba(220, 53, 69, 0.11);
  --tone-info: #0b5ed7;    --tone-info-bg: rgba(13, 110, 253, 0.1);
  --tone-neutral: #55616a; --tone-neutral-bg: rgba(108, 117, 125, 0.12);

  --radius-card: 20px;
  --radius-md: 14px;
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-green: 0 8px 28px rgba(93, 138, 47, 0.22);
  --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
}

.mi-laboratorio[data-bs-theme="dark"],
[data-bs-theme="dark"] .mi-laboratorio,
.ml-overlay[data-bs-theme="dark"] {
  --sena-text: #e8ede3;
  --sena-muted: #8a9e7c;
  --sena-border: rgba(122, 171, 61, 0.16);
  --sena-green-pale: rgba(93, 138, 47, 0.14);
  --page-bg: #0c0f0a;
  --surface: #131a0e;
  --surface-alt: #0f150b;
  --tone-ok: #5fd08a;
  --tone-warn: #f0b429;
  --tone-danger: #ff7b72;
  --tone-info: #6ea8fe;
  --tone-neutral: #a3adb5;
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.mi-laboratorio {
  font-family: var(--font-body);
  background: var(--page-bg);
  min-height: 100vh;
  color: var(--sena-text);
}

/* ============================================================
   BOTONES
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.62rem 1.25rem;
  border-radius: 50px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  border: 1.5px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
}
.btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
.btn:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.btn-primary {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  color: #fff;
  box-shadow: var(--shadow-green);
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(93, 138, 47, 0.3); }
.btn-secondary { background: transparent; border-color: var(--sena-green); color: var(--sena-green); }
[data-bs-theme="dark"] .btn-secondary { color: var(--sena-green-light); border-color: var(--sena-green-light); }
.btn-secondary:hover:not(:disabled) { background: var(--sena-green); border-color: var(--sena-green); color: #fff; }
.btn-danger { background: transparent; border-color: var(--tone-danger); color: var(--tone-danger); }
.btn-danger:hover:not(:disabled) { background: var(--tone-danger); color: #fff; }
.btn-sm { padding: 0.42rem 0.95rem; font-size: 0.78rem; }
.btn-block { width: 100%; }
.btn-grow { flex: 1; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================================
   ENCABEZADO
   ============================================================ */
.lab-header {
  padding: 2.5rem 0 1.5rem;
  background: linear-gradient(180deg, var(--sena-green-pale) 0%, transparent 100%);
}
.header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--sena-green-light);
  margin-bottom: 0.35rem;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3vw, 2.4rem);
  font-weight: 700;
  margin: 0;
}
.page-subtitle { color: var(--sena-muted); margin: 0.35rem 0 0; font-size: 0.95rem; max-width: 60ch; }

.lab-main { padding: 1rem 0 4rem; }

/* ============================================================
   SECCIONES
   ============================================================ */
.section + .section { margin-top: 2.5rem; }
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.section-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin: 0; }
.section-subtitle { color: var(--sena-muted); font-size: 0.88rem; margin: 0.3rem 0 0; }
.count-pill {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--sena-green);
  background: var(--sena-green-pale);
  border: 1px solid var(--sena-border);
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
}

/* ============================================================
   ONBOARDING (sin laboratorio)
   ============================================================ */
.empty-hero {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 2rem;
}
.empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--sena-green);
  background: var(--sena-green-pale);
}
.empty-hero h2 { font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 0.5rem; }
.empty-hero p { color: var(--sena-muted); font-size: 0.95rem; line-height: 1.6; margin: 0; }

.onboarding-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

/* ============================================================
   PANELES
   ============================================================ */
.panel {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.panel.is-skeleton { padding: 1.5rem; gap: 0.75rem; }
.panel-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.15rem 1.35rem;
  border-bottom: 1px solid var(--sena-border);
  background: var(--surface-alt);
}
.panel-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  flex-shrink: 0;
}
.panel-title { font-size: 1rem; font-weight: 700; margin: 0; }
.panel-sub { font-size: 0.78rem; color: var(--sena-muted); margin: 0.1rem 0 0; }
.panel-body { padding: 1.35rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-footer { padding: 0 1.35rem 1.35rem; }

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: var(--tone-info-bg);
  color: var(--tone-info);
  font-size: 0.8rem;
  line-height: 1.45;
}
.info-box span { color: var(--sena-text); }

/* ============================================================
   TARJETAS DE LABORATORIO
   ============================================================ */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 1.25rem;
}
.lab-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.35rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.lab-card:hover { box-shadow: var(--shadow-md); border-color: var(--sena-green-light); }
.lab-card-head { display: flex; align-items: flex-start; gap: 0.85rem; }
.lab-avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  flex-shrink: 0;
}
.lab-meta { flex: 1; min-width: 0; }
.lab-name { font-size: 1.02rem; font-weight: 700; margin: 0; }
.lab-id { font-family: var(--font-mono); font-size: 0.72rem; color: var(--sena-muted); }

.role-pill,
.acred-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}
.role-admin { background: var(--sena-green-pale); color: var(--sena-green); }
.role-tecnico { background: var(--tone-info-bg); color: var(--tone-info); }
.role-contacto,
.role-miembro { background: var(--tone-neutral-bg); color: var(--tone-neutral); }
.role-pendiente { background: var(--tone-warn-bg); color: var(--tone-warn); }
.ac-si { background: var(--tone-ok-bg); color: var(--tone-ok); }
.ac-en_proceso { background: var(--tone-warn-bg); color: var(--tone-warn); }
.ac-no { background: var(--tone-neutral-bg); color: var(--tone-neutral); }

.lab-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 0;
  padding: 0.85rem;
  border-radius: 12px;
  background: var(--surface-alt);
}
.lab-data > div { min-width: 0; }
.lab-data dt {
  font-size: 0.66rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--sena-muted);
}
.lab-data dd {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lab-actions { display: flex; gap: 0.5rem; margin-top: auto; flex-wrap: wrap; }

/* ============================================================
   SOLICITUDES
   ============================================================ */
.request-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.request-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.15rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-left: 4px solid var(--tone-warn);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}
.request-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  background: var(--tone-warn-bg);
  color: var(--tone-warn);
  flex-shrink: 0;
}
.request-info { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 0.15rem; }
.request-name { font-size: 0.92rem; }
.request-sub { font-size: 0.75rem; color: var(--sena-muted); display: inline-flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
.request-sub .dot { opacity: 0.6; }
.request-actions { display: flex; gap: 0.5rem; }

.empty-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: var(--surface);
  border: 2px dashed var(--sena-border);
  border-radius: var(--radius-card);
}
.empty-state > i { font-size: 2.4rem; color: var(--sena-muted); opacity: 0.7; display: block; margin-bottom: 0.6rem; }
.empty-state h4 { font-weight: 600; margin-bottom: 0.35rem; font-size: 1rem; }
.empty-state p { color: var(--sena-muted); font-size: 0.86rem; margin: 0 auto; max-width: 420px; }

/* Skeleton */
.sk {
  background: linear-gradient(90deg, rgba(93,138,47,0.08) 25%, rgba(93,138,47,0.16) 37%, rgba(93,138,47,0.08) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
}
.sk-line { height: 14px; }
.sk-block { height: 90px; border-radius: 12px; }
.w-50 { width: 50%; }
.w-75 { width: 75%; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* ============================================================
   CAMPOS
   ============================================================ */
.field { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field-label { font-size: 0.8rem; font-weight: 600; color: var(--sena-text); }
.req { color: var(--tone-danger); }
.field-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1.5px solid var(--sena-border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--sena-text);
  font-family: var(--font-body);
  font-size: 0.86rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field-input:focus { outline: none; border-color: var(--sena-green-light); box-shadow: 0 0 0 3px rgba(122, 171, 61, 0.2); }
.field-input:disabled { background: var(--surface-alt); color: var(--sena-muted); cursor: not-allowed; }
.field-input.is-invalid { border-color: var(--tone-danger); box-shadow: 0 0 0 3px var(--tone-danger-bg); }
.field-input.mono { font-family: var(--font-mono); letter-spacing: 0.05em; }
[data-bs-theme="dark"] .field-input { color-scheme: dark; }
.field-hint { font-size: 0.72rem; color: var(--sena-muted); }
.field-error { font-size: 0.72rem; color: var(--tone-danger); font-weight: 500; }

.segmented {
  display: flex;
  padding: 3px;
  gap: 3px;
  background: var(--surface-alt);
  border: 1px solid var(--sena-border);
  border-radius: 10px;
  flex-wrap: wrap;
}
.segmented button {
  flex: 1;
  min-width: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--sena-muted);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.segmented button.active { background: var(--surface); color: var(--sena-text); box-shadow: var(--shadow-sm); }
.segmented button:disabled { cursor: not-allowed; opacity: 0.7; }

/* ============================================================
   MODAL
   ============================================================ */
.ml-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(8, 14, 5, 0.55);
  backdrop-filter: blur(4px);
  font-family: var(--font-body);
  color: var(--sena-text);
}
.ml-modal {
  width: 100%;
  max-width: 820px;
  max-height: calc(100vh - 2.5rem);
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.ml-modal-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.35rem;
  border-bottom: 1px solid var(--sena-border);
  flex-shrink: 0;
}
.ml-modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  flex-shrink: 0;
}
.ml-modal-heading { flex: 1; min-width: 0; }
.ml-modal-title { margin: 0; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-modal-subtitle { margin: 0.1rem 0 0; font-size: 0.74rem; color: var(--sena-muted); font-family: var(--font-mono); }
.ml-modal-close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--sena-border);
  background: transparent;
  color: var(--sena-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}
.ml-modal-close:hover:not(:disabled) { background: var(--surface-alt); color: var(--sena-text); }

.ml-tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0 1.35rem;
  border-bottom: 1px solid var(--sena-border);
  background: var(--surface-alt);
  flex-shrink: 0;
  overflow-x: auto;
}
.ml-tabs button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 0.9rem;
  border: none;
  background: transparent;
  color: var(--sena-muted);
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: var(--transition);
  white-space: nowrap;
}
.ml-tabs button:hover { color: var(--sena-text); }
.ml-tabs button.active { color: var(--sena-green); border-bottom-color: var(--sena-green); }

.ml-modal-body { flex: 1; overflow-y: auto; padding: 1.35rem; }

.alert-inline {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.75rem 0.9rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: var(--tone-danger-bg);
  border: 1px solid var(--tone-danger);
  color: var(--tone-danger);
  font-size: 0.82rem;
}
.readonly-note {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 1rem;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  background: var(--tone-neutral-bg);
  color: var(--sena-muted);
  font-size: 0.8rem;
}

.form-section + .form-section {
  margin-top: 1.35rem;
  padding-top: 1.35rem;
  border-top: 1px dashed var(--sena-border);
}
.form-section-title {
  margin: 0 0 0.85rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--sena-muted);
}
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 1rem; }
.span-2 { grid-column: span 2; }

.ml-modal-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.35rem;
  border-top: 1px solid var(--sena-border);
  background: var(--surface-alt);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.footer-note { font-size: 0.74rem; color: var(--sena-muted); }
.footer-actions { display: flex; gap: 0.5rem; margin-left: auto; }

.ml-modal-enter-active,
.ml-modal-leave-active { transition: opacity 0.18s ease; }
.ml-modal-enter-active .ml-modal,
.ml-modal-leave-active .ml-modal { transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.18s ease; }
.ml-modal-enter-from,
.ml-modal-leave-to { opacity: 0; }
.ml-modal-enter-from .ml-modal,
.ml-modal-leave-to .ml-modal { transform: translateY(14px) scale(0.98); opacity: 0; }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .header-row .btn { width: 100%; }
  .cards-grid,
  .onboarding-grid { grid-template-columns: 1fr; }
  .form-grid,
  .field-row { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
  .lab-data { grid-template-columns: 1fr; }
  .request-actions { width: 100%; }
  .request-actions .btn { flex: 1; }
}
@media (max-width: 576px) {
  .ml-overlay { padding: 0; align-items: flex-end; }
  .ml-modal { max-height: 94vh; border-radius: 22px 22px 0 0; }
  .footer-note { display: none; }
  .footer-actions { width: 100%; }
  .footer-actions .btn { flex: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sk, .spinner { animation: none; }
  .btn-primary:hover:not(:disabled),
  .lab-card:hover { transform: none; }
}
</style>
