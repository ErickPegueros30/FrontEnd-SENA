<template>
  <div :data-bs-theme="currentTheme" class="mi-laboratorio">
    <!-- ============================================================
         Encabezado
         ============================================================ -->
    <header class="lab-header">
      <div class="container">
        <div class="header-row">
          <div class="header-text">
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
        <div v-if="loading" class="stack" aria-hidden="true">
          <div class="panel is-skeleton hero-skeleton">
            <div class="sk sk-line w-50"></div>
            <div class="sk sk-line w-75"></div>
          </div>
          <div class="info-grid">
            <div v-for="n in 3" :key="`sk-${n}`" class="panel is-skeleton">
              <div class="sk sk-line w-50"></div>
              <div class="sk sk-line w-75"></div>
              <div class="sk sk-block"></div>
            </div>
          </div>
        </div>

        <!-- ============================================================
             Sin laboratorio: asistente por pasos
             ============================================================ -->
        <div v-else-if="labs.length === 0" class="wizard">
          <ol class="stepper" aria-label="Progreso">
            <li class="stepper-item" :class="{ active: wizardStep === 'choose', done: wizardStep !== 'choose' }">
              <span class="stepper-dot">
                <i v-if="wizardStep !== 'choose'" class="bi bi-check-lg"></i>
                <template v-else>1</template>
              </span>
              <span class="stepper-label">Tu situación</span>
            </li>
            <li class="stepper-line" :class="{ filled: wizardStep !== 'choose' }" aria-hidden="true"></li>
            <li class="stepper-item" :class="{ active: wizardStep !== 'choose' }">
              <span class="stepper-dot">2</span>
              <span class="stepper-label">{{ wizardStep === 'join' ? 'Tu laboratorio' : wizardStep === 'create' ? 'Datos básicos' : 'Continuar' }}</span>
            </li>
          </ol>

          <Transition name="step" mode="out-in">
            <!-- Paso 1: ¿tienes laboratorio? -->
            <section v-if="wizardStep === 'choose'" key="choose" class="step-card">
              <div class="step-hero">
                <div class="empty-icon"><i class="bi bi-buildings"></i></div>
                <h2>¿Ya tienes un laboratorio registrado?</h2>
                <p>
                  Cada cuenta pertenece a un solo laboratorio, y todos sus miembros ven los mismos ensayos.
                  Cuéntanos tu caso y te guiamos en un par de pasos.
                </p>
              </div>

              <div class="choice-grid">
                <button type="button" class="choice-card" @click="goTo('join')">
                  <span class="choice-icon"><i class="bi bi-people"></i></span>
                  <span class="choice-text">
                    <strong>Sí, ya tengo uno</strong>
                    <small>Me uniré con el ID del laboratorio</small>
                  </span>
                  <i class="bi bi-arrow-right choice-arrow"></i>
                </button>

                <button type="button" class="choice-card" @click="goTo('create')">
                  <span class="choice-icon"><i class="bi bi-plus-circle"></i></span>
                  <span class="choice-text">
                    <strong>No, quiero crear uno</strong>
                    <small>Serás su administrador</small>
                  </span>
                  <i class="bi bi-arrow-right choice-arrow"></i>
                </button>
              </div>
            </section>

            <!-- Paso 2A: unirse con ID -->
            <form v-else-if="wizardStep === 'join'" key="join" class="step-card" @submit.prevent="solicitarJoin">
              <button type="button" class="back-link" @click="goTo('choose')">
                <i class="bi bi-arrow-left"></i> Volver
              </button>

              <div class="step-head">
                <div class="panel-icon"><i class="bi bi-people"></i></div>
                <div>
                  <h2 class="step-title">Únete a tu laboratorio</h2>
                  <p class="step-sub">Un administrador deberá aprobar tu solicitud.</p>
                </div>
              </div>

              <div class="field">
                <label class="field-label" for="join-id">ID del laboratorio</label>
                <input
                  id="join-id"
                  v-model="joinId"
                  class="field-input field-input-lg mono"
                  inputmode="numeric"
                  placeholder="Ej. 12"
                  autocomplete="off"
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

              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="!joinId || joining">
                <span v-if="joining" class="spinner"></span>
                <i v-else class="bi bi-send"></i>
                {{ joining ? 'Enviando...' : 'Solicitar unirme' }}
              </button>

              <p class="step-alt">
                ¿No tienes el ID?
                <button type="button" class="link-btn" @click="goTo('create')">Crea un laboratorio nuevo</button>
              </p>
            </form>

            <!-- Paso 2B: crear laboratorio -->
            <form v-else key="create" class="step-card" @submit.prevent="createLab">
              <button type="button" class="back-link" @click="goTo('choose')">
                <i class="bi bi-arrow-left"></i> Volver
              </button>

              <div class="step-head">
                <div class="panel-icon"><i class="bi bi-plus-circle"></i></div>
                <div>
                  <h2 class="step-title">Crea tu laboratorio</h2>
                  <p class="step-sub">Solo necesitamos lo básico; el resto lo completas después.</p>
                </div>
              </div>

              <div class="form-grid">
                <div class="field span-2">
                  <label class="field-label" for="new-nombre">Nombre del laboratorio <span class="req">*</span></label>
                  <input
                    id="new-nombre"
                    v-model.trim="form.nombre"
                    class="field-input"
                    :class="{ 'is-invalid': createErrors.nombre }"
                    placeholder="Ej. Laboratorio de Metrología Norte"
                  />
                  <span v-if="createErrors.nombre" class="field-error">{{ createErrors.nombre }}</span>
                </div>

                <div class="field span-2">
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

                <div class="field span-2">
                  <label class="field-label" for="new-tel">Teléfono técnico</label>
                  <input id="new-tel" v-model.trim="form.tel_tecnico" class="field-input" placeholder="442 123 4567" />
                </div>

                <div class="field">
                  <label class="field-label" for="new-municipio">Municipio</label>
                  <input id="new-municipio" v-model.trim="form.municipio" class="field-input" />
                </div>
                <div class="field">
                  <label class="field-label" for="new-estado">Estado</label>
                  <input id="new-estado" v-model.trim="form.estado" class="field-input" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="submitting">
                <span v-if="submitting" class="spinner"></span>
                <i v-else class="bi bi-check2"></i>
                {{ submitting ? 'Creando...' : 'Crear laboratorio' }}
              </button>

              <p class="step-alt">
                ¿Tu laboratorio ya existe?
                <button type="button" class="link-btn" @click="goTo('join')">Únete con su ID</button>
              </p>
            </form>
          </Transition>
        </div>

        <!-- ============================================================
             Con laboratorio (un usuario solo pertenece a uno)
             ============================================================ -->
        <div v-else-if="lab" class="lab-content">
          <!-- Solicitud en revisión -->
          <section v-if="isPending" class="pending-panel">
            <div class="pending-icon"><i class="bi bi-hourglass-split"></i></div>
            <h2 class="pending-title">Tu solicitud está en revisión</h2>
            <p class="pending-text">
              Un administrador de <strong>{{ lab.nombre }}</strong>
              <span class="mono">(ID {{ lab.laboratorio_id }})</span> debe aprobar tu acceso.
              Cuando lo haga, verás aquí los datos del laboratorio y a su equipo.
            </p>
            <div class="pending-actions">
              <button type="button" class="btn btn-secondary" :disabled="joining" @click="load">
                <i class="bi bi-arrow-clockwise"></i> Revisar estado
              </button>
              <button type="button" class="btn btn-primary" :disabled="joining" @click="reenviarSolicitud">
                <span v-if="joining" class="spinner"></span>
                <i v-else class="bi bi-send"></i> Reenviar solicitud
              </button>
            </div>
          </section>

          <template v-else>
            <section class="section">
              <div class="section-head">
                <div>
                  <span class="eyebrow">Resumen</span>
                  <h2 class="section-title">Tu laboratorio</h2>
                </div>
              </div>

              <div class="stack">
                <!-- Tarjeta principal -->
                <article class="lab-hero">
                  <div class="hero-top">
                    <div class="hero-main">
                      <div class="lab-avatar lab-avatar-lg">{{ initials(labData.nombre) }}</div>
                      <div class="hero-info">
                        <div class="hero-badges">
                          <span class="role-pill" :class="`role-${roleKey(lab.rol_equipo)}`">
                            <i :class="roleMeta(lab.rol_equipo).icon"></i>
                            {{ roleMeta(lab.rol_equipo).label }}
                          </span>
                          <span v-if="labData.acreditado" class="acred-pill" :class="`ac-${labData.acreditado}`">
                            <i class="bi bi-patch-check"></i> Acreditación: {{ acreditadoLabel(labData.acreditado) }}
                          </span>
                        </div>
                        <h3 class="hero-name">{{ labData.nombre }}</h3>
                        <div class="id-box">
                          <div class="id-box-text">
                            <span class="id-box-label">ID del laboratorio</span>
                            <strong class="id-box-value">{{ lab.laboratorio_id }}</strong>
                          </div>
                          <button type="button" class="id-box-copy" title="Copiar ID" @click="copyId">
                            <i class="bi bi-clipboard"></i> Copiar
                          </button>
                        </div>
                        <span class="id-hint">Comparte este ID para que tu equipo se una.</span>
                      </div>
                    </div>

                    <div class="hero-actions">
                      <button type="button" class="btn btn-primary" :disabled="opening !== null" @click="openEdit('lab')">
                        <span v-if="opening !== null" class="spinner"></span>
                        <i v-else :class="canEdit(lab) ? 'bi bi-pencil' : 'bi bi-eye'"></i>
                        {{ canEdit(lab) ? 'Editar datos' : 'Ver datos' }}
                      </button>
                      <button type="button" class="btn btn-secondary" :disabled="opening !== null" @click="openEdit('facturacion')">
                        <i class="bi bi-receipt"></i> Facturación
                      </button>
                    </div>
                  </div>

                  <div class="hero-stats">
                    <div class="stat">
                      <span class="stat-icon"><i class="bi bi-people"></i></span>
                      <div>
                        <div class="stat-value">{{ miembros.length }}</div>
                        <div class="stat-label">{{ miembros.length === 1 ? 'Miembro' : 'Miembros' }}</div>
                      </div>
                    </div>
                    <div v-if="isAdminOrTech" class="stat">
                      <span class="stat-icon stat-icon-warn"><i class="bi bi-inbox"></i></span>
                      <div>
                        <div class="stat-value">{{ solicitudes.length }}</div>
                        <div class="stat-label">{{ solicitudes.length === 1 ? 'Solicitud pendiente' : 'Solicitudes pendientes' }}</div>
                      </div>
                    </div>
                    <div class="stat">
                      <span class="stat-icon"><i class="bi bi-clipboard2-check"></i></span>
                      <div>
                        <div class="stat-value">{{ profilePercent }}%</div>
                        <div class="stat-label">Perfil completo</div>
                      </div>
                    </div>
                  </div>
                </article>

                <!-- Progreso del perfil -->
                <div v-if="canEdit(lab) && profilePercent < 100" class="completeness">
                  <div class="completeness-head">
                    <div>
                      <strong>Completa el perfil de tu laboratorio</strong>
                      <span>{{ profileDone }} de {{ profileChecks.length }} secciones listas</span>
                    </div>
                    <span class="completeness-pct">{{ profilePercent }}%</span>
                  </div>
                  <div
                    class="progress"
                    role="progressbar"
                    aria-label="Perfil completo"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :aria-valuenow="profilePercent"
                  >
                    <span :style="{ width: `${profilePercent}%` }"></span>
                  </div>
                  <ul class="check-list">
                    <li v-for="c in profileChecks" :key="c.key">
                      <button
                        type="button"
                        class="check-chip"
                        :class="{ done: c.done }"
                        :disabled="c.done || opening !== null"
                        @click="openEdit(c.tab)"
                      >
                        <i :class="c.done ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'"></i> {{ c.label }}
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Datos organizados por tema -->
                <div class="info-grid">
                  <article
                    v-for="card in infoCards"
                    :key="card.key"
                    class="info-card"
                    :class="{ 'info-card-wide': card.wide }"
                  >
                    <header class="info-card-head">
                      <span class="info-card-icon"><i :class="card.icon"></i></span>
                      <h3 class="info-card-title">{{ card.title }}</h3>
                      <button
                        v-if="canEdit(lab)"
                        type="button"
                        class="icon-btn"
                        :aria-label="`Editar ${card.title}`"
                        :title="`Editar ${card.title}`"
                        :disabled="opening !== null"
                        @click="openEdit(card.tab)"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                    </header>
                    <dl class="info-list">
                      <div v-for="row in card.rows" :key="row.label" class="info-row">
                        <dt>{{ row.label }}</dt>
                        <dd :class="{ mono: row.mono, 'is-empty': row.value === '—' }">{{ row.value }}</dd>
                      </div>
                    </dl>
                  </article>
                </div>
              </div>
            </section>

            <!-- Miembros -->
            <section class="section">
              <div class="section-head">
                <div>
                  <span class="eyebrow">Equipo</span>
                  <h2 class="section-title">Miembros de tu laboratorio</h2>
                  <p class="section-subtitle">Personas que forman parte de tu laboratorio.</p>
                </div>
                <span class="count-pill">{{ miembros.length }}</span>
              </div>

              <!-- Agregar miembro por correo (solo administrador) -->
              <form v-if="isAdmin" class="add-member" novalidate @submit.prevent="addMember">
                <label class="field-label" for="add-member-email">
                  <i class="bi bi-person-plus"></i> Agregar miembro por correo electrónico
                </label>
                <div class="add-member-row">
                  <div class="add-member-input">
                    <input
                      id="add-member-email"
                      v-model.trim="newMemberEmail"
                      type="email"
                      class="field-input"
                      :class="{ 'is-invalid': lookup.status === 'invalid' }"
                      placeholder="correo@ejemplo.com"
                      autocomplete="off"
                      :disabled="addingMember"
                    />
                    <span v-if="lookup.status === 'searching'" class="spinner add-member-spin" aria-hidden="true"></span>
                  </div>
                  <select v-model="newMemberRole" class="member-role-select add-member-role" aria-label="Rol del nuevo miembro" :disabled="addingMember">
                    <option v-for="role in assignableRoles" :key="role.value" :value="role.value">{{ role.label }}</option>
                  </select>
                </div>

                <p v-if="lookupMessage" class="add-member-msg" :class="`is-${lookup.status}`" role="status">
                  <i :class="lookupIcon"></i> {{ lookupMessage }}
                </p>

                <!-- Solo aparece cuando el correo es válido y pertenece a un usuario registrado -->
                <div v-if="lookup.status === 'found' && lookup.user" class="found-user">
                  <div class="member-avatar">{{ initials(lookup.user.fullName) }}</div>
                  <div class="member-info">
                    <h3 class="member-name">{{ lookup.user.fullName }}</h3>
                    <span class="member-contact"><i class="bi bi-envelope"></i>{{ lookup.user.correo }}</span>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" :disabled="addingMember">
                    <span v-if="addingMember" class="spinner"></span>
                    <i v-else class="bi bi-plus-lg"></i> Agregar al laboratorio
                  </button>
                </div>
              </form>

              <div v-if="membersLoading" class="member-grid">
                <div v-for="n in 3" :key="`member-sk-${n}`" class="member-card is-skeleton" aria-hidden="true">
                  <div class="sk sk-avatar"></div>
                  <div class="sk sk-line w-75"></div>
                  <div class="sk sk-line w-50"></div>
                </div>
              </div>
              <div v-else-if="miembros.length" class="member-grid">
                <article v-for="member in miembros" :key="memberKey(member)" class="member-card">
                  <div class="member-avatar">{{ initials(member.fullName) }}</div>
                  <div class="member-info">
                    <h3 class="member-name">{{ member.fullName }}</h3>
                    <span class="member-contact" v-if="member.correo">
                      <i class="bi bi-envelope"></i>{{ member.correo }}
                    </span>
                  </div>
                  <span class="role-pill" :class="`role-${roleKey(member.rol_equipo)}`">
                    <i :class="roleMeta(member.rol_equipo).icon"></i>
                    {{ roleMeta(member.rol_equipo).label }}
                  </span>
                  <div v-if="canManageMember(member)" class="member-role-control">
                    <label class="visually-hidden" :for="`member-role-${memberKey(member)}`">
                      Rol de {{ member.fullName }}
                    </label>
                    <select
                      :id="`member-role-${memberKey(member)}`"
                      class="member-role-select"
                      :value="roleKey(member.rol_equipo)"
                      :disabled="updatingMember === memberKey(member)"
                      @change="updateMemberRole(member, ($event.target as HTMLSelectElement).value)"
                    >
                      <option v-for="role in assignableRoles" :key="role.value" :value="role.value">
                        {{ role.label }}
                      </option>
                    </select>
                  </div>
                </article>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-people"></i>
                <h4>Aún no hay miembros para mostrar</h4>
                <p>Cuando se aprueben integrantes, aparecerán aquí.</p>
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
                <span class="count-pill" :class="{ 'count-pill-warn': solicitudes.length }">{{ solicitudes.length }}</span>
              </div>

              <div v-if="solicitudes.length === 0" class="empty-state">
                <i class="bi bi-inbox"></i>
                <h4>Sin solicitudes</h4>
                <p>Cuando alguien pida unirse a tu laboratorio, aparecerá aquí para que lo apruebes.</p>
              </div>

              <ul v-else class="request-list">
                <li v-for="s in solicitudes" :key="requestKey(s)" class="request-item">
                  <div class="request-avatar">{{ initials(`${s.nombre || ''} ${s.primer_apellido || ''}`) }}</div>
                  <div class="request-info">
                    <strong class="request-name">{{ s.nombre }} {{ s.primer_apellido }}</strong>
                    <span class="request-sub">
                      <i class="bi bi-person-badge"></i>{{ s.usuario_id }}
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
          </template>
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
              <button class="ml-modal-close" aria-label="Cerrar" :disabled="saving || (showMandatoryModal && !labIsComplete)" @click="closeModal">
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
              <div v-if="showMandatoryModal && !labIsComplete" class="alert-inline alert-warn" role="status">
                <i class="bi bi-info-circle-fill"></i>
                <span>Completa los datos obligatorios de tu laboratorio para continuar.</span>
              </div>
              <div v-if="modalError" class="alert-inline" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>{{ modalError }}</span>
              </div>
              <p v-if="!canEdit(selectedLab)" class="readonly-note">
                <i class="bi bi-eye"></i> Solo lectura: necesitas rol de administrador o contacto para editar.
              </p>

              <!-- Secciones definidas por configuración (pestañas lab y facturación) -->
              <section v-for="section in currentSections" :key="`${activeTab}-${section.title}`" class="form-section">
                <h6 class="form-section-title">{{ section.title }}</h6>
                <div class="form-grid">
                  <div v-for="f in section.fields" :key="f.key" class="field" :class="{ 'span-2': f.span2 }">
                    <label class="field-label" :for="`${activeTab}-${f.key}`">
                      {{ f.label }} <span v-if="f.required" class="req">*</span>
                    </label>
                    <select
                      v-if="f.options"
                      :id="`${activeTab}-${f.key}`"
                      v-model="currentModel[f.key]"
                      class="field-input"
                      :disabled="readOnly"
                    >
                      <option v-for="o in f.options" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
                    </select>
                    <input
                      v-else
                      :id="`${activeTab}-${f.key}`"
                      v-model.trim="currentModel[f.key]"
                      :type="f.type || 'text'"
                      class="field-input"
                      :class="{ mono: f.mono, 'is-invalid': currentErrors[f.key] }"
                      :placeholder="f.placeholder"
                      :maxlength="f.maxlength"
                      :disabled="readOnly"
                    />
                    <span v-if="currentErrors[f.key]" class="field-error">{{ currentErrors[f.key] }}</span>
                  </div>
                </div>
              </section>

              <!-- Operación y acreditación (solo pestaña laboratorio) -->
              <section v-if="activeTab === 'lab'" class="form-section">
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
                      <label class="field-label" for="lab-a_especificacion">Especificación <span class="req">*</span></label>
                      <input
                        id="lab-a_especificacion"
                        v-model.trim="labForm.a_especificacion"
                        class="field-input"
                        :class="{ 'is-invalid': labErrors.a_especificacion }"
                        placeholder="ISO/IEC 17025:2017"
                        :disabled="readOnly"
                      />
                      <span v-if="labErrors.a_especificacion" class="field-error">{{ labErrors.a_especificacion }}</span>
                    </div>
                    <div class="field">
                      <label class="field-label" for="lab-a_numero">Número de acreditación <span class="req">*</span></label>
                      <input
                        id="lab-a_numero"
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
            </div>

            <div class="ml-modal-footer">
              <span class="footer-note"><span class="req">*</span> Campos obligatorios</span>
              <div class="footer-actions">
                <button type="button" class="btn btn-secondary" :disabled="saving || (showMandatoryModal && !labIsComplete)" @click="closeModal">
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
import { useRoute } from 'vue-router'
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

interface Miembro {
  equipo_id: number
  laboratorio_id: number
  usuario_id: string
  rol_equipo?: string
  nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  correo?: string
  fullName: string
}

interface LabDetail {
  laboratorio?: Laboratorio
  facturacion?: Record<string, any> | null
}

interface Meta { label: string; icon: string }

interface FieldOption { value: string | null; label: string }
interface FieldDef {
  key: string
  label: string
  span2?: boolean
  required?: boolean
  type?: string
  placeholder?: string
  mono?: boolean
  maxlength?: number
  options?: FieldOption[]
}
interface FieldSection { title: string; fields: FieldDef[] }

type WizardStep = 'choose' | 'join' | 'create'

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
const ROLES_EDITORES = ['admin', 'contacto']
// Roles que indican una solicitud sin aprobar
const ROLES_PENDIENTES = ['pendiente', 'solicitante', 'solicitud']
const assignableRoles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'contacto', label: 'Contacto' },
  { value: 'miembro', label: 'Miembro' }
]

const ACREDITADO_OPTS = [
  { value: 'no', label: 'No' },
  { value: 'si', label: 'Sí' },
  { value: 'en_proceso', label: 'En proceso' }
]

const ENTREGA_OPTS = [
  { value: 'instalaciones_sena', label: 'En instalaciones SENA', icon: 'bi bi-building' },
  { value: 'paqueteria', label: 'Vía paquetería', icon: 'bi bi-truck' }
]

const METODO_PAGO_OPTS = [
  { value: 'PUE', label: 'PUE — Pago en una sola exhibición' },
  { value: 'PPD', label: 'PPD — Pago en parcialidades o diferido' }
]

const TABS = [
  { key: 'lab', label: 'Laboratorio', icon: 'bi bi-building' },
  { key: 'facturacion', label: 'Facturación', icon: 'bi bi-receipt' }
] as const

type TabKey = typeof TABS[number]['key']

interface InfoRow { label: string; value: string; mono?: boolean }
interface InfoCard { key: string; title: string; icon: string; tab: TabKey; wide?: boolean; rows: InfoRow[] }
interface ProfileCheck { key: string; label: string; done: boolean; tab: TabKey }

// Campos del modal definidos por configuración (evita repetir el mismo bloque de HTML por campo)
const LAB_SECTIONS: FieldSection[] = [
  {
    title: 'Identificación',
    fields: [
      { key: 'nombre', label: 'Nombre', span2: true, required: true },
      { key: 'correo_1', label: 'Correo principal', required: true, type: 'email' },
      { key: 'correo_2', label: 'Correo alterno', type: 'email' },
      { key: 'tel_tecnico', label: 'Teléfono técnico' },
      { key: 'tel_fijo', label: 'Teléfono fijo' }
    ]
  },
  {
    title: 'Dirección',
    fields: [
      { key: 'calle', label: 'Calle', span2: true },
      { key: 'no_ext', label: 'No. exterior' },
      { key: 'no_int', label: 'No. interior' },
      { key: 'colonia', label: 'Colonia' },
      { key: 'cp', label: 'Código postal' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'delegacion', label: 'Delegación' },
      { key: 'estado', label: 'Estado', span2: true }
    ]
  }
]

const FACT_SECTIONS: FieldSection[] = [
  {
    title: 'Datos fiscales',
    fields: [
      { key: 'razon_social', label: 'Razón social', span2: true, required: true },
      { key: 'rfc', label: 'RFC', required: true, mono: true, maxlength: 13 },
      { key: 'regimen_fiscal', label: 'Régimen fiscal' }
    ]
  },
  {
    title: 'Domicilio fiscal',
    fields: [
      { key: 'calle', label: 'Calle', span2: true },
      { key: 'no_ext', label: 'No. exterior' },
      { key: 'no_int', label: 'No. interior' },
      { key: 'colonia', label: 'Colonia' },
      { key: 'cp', label: 'Código postal' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'estado', label: 'Estado' }
    ]
  },
  {
    title: 'Pago',
    fields: [
      { key: 'cfdi', label: 'Uso del CFDI', placeholder: 'G03' },
      {
        key: 'metodo_pago',
        label: 'Método de pago',
        options: [{ value: null, label: 'Sin especificar' }, ...METODO_PAGO_OPTS]
      },
      { key: 'forma_pago', label: 'Forma de pago', placeholder: '03' },
      { key: 'institucion_bancaria', label: 'Institución bancaria' },
      { key: 'cuenta_clabe', label: 'Cuenta o CLABE', span2: true, mono: true },
      { key: 'correo_1', label: 'Correo de facturación', type: 'email' },
      { key: 'tel_tecnico', label: 'Teléfono' }
    ]
  }
]

/* ============================================================
   Estado
   ============================================================ */
const { api, authHeaders } = useApiBase()
const { currentTheme } = useTheme()
const { toastRef, showToast } = useToast()
const route = useRoute()

const loading = ref(true)
const submitting = ref(false)
const joining = ref(false)
const saving = ref(false)
const opening = ref<number | null>(null)
const acting = ref<string | null>(null)
const membersLoading = ref(false)
const updatingMember = ref<string | null>(null)

// La API devuelve una lista, pero un usuario solo pertenece a un laboratorio: se usa el primero
const labs = ref<Laboratorio[]>([])
const labDetail = ref<LabDetail | null>(null)
const miembros = ref<Miembro[]>([])
const solicitudes = ref<Solicitud[]>([])
const joinId = ref('')
const joinError = ref('')

// Paso actual del asistente cuando el usuario aún no tiene laboratorio
const wizardStep = ref<WizardStep>('choose')

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
const showMandatoryModal = ref(false)

// Secciones, modelo y errores según la pestaña activa del modal
const currentSections = computed(() => (activeTab.value === 'lab' ? LAB_SECTIONS : FACT_SECTIONS))
const currentModel = computed(() => (activeTab.value === 'lab' ? labForm : factForm))
const currentErrors = computed(() => (activeTab.value === 'lab' ? labErrors : factErrors))

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

const has = (v: unknown) => String(v ?? '').trim() !== ''
const show = (v: unknown) => (has(v) ? String(v).trim() : '—')

// Muestra solo los últimos 4 dígitos de una cuenta o CLABE
const maskAccount = (v: unknown) => {
  const s = String(v ?? '').replace(/\s/g, '')
  if (!s) return '—'
  return s.length > 4 ? `•••• ${s.slice(-4)}` : s
}

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

// Laboratorio del usuario y sus datos completos (el listado puede traer menos campos que el detalle)
const lab = computed<Laboratorio | null>(() => labs.value[0] ?? null)
const labData = computed<Partial<Laboratorio>>(() => ({
  ...(lab.value || {}),
  ...(labDetail.value?.laboratorio || {}),
  rol_equipo: lab.value?.rol_equipo
}))
const factData = computed<Record<string, any>>(() => labDetail.value?.facturacion || {})

const isPending = computed(() => !!lab.value && esSolicitudPendiente(lab.value))
const isAdminOrTech = computed(() => !!lab.value && ['admin', 'tecnico'].includes(roleKey(lab.value.rol_equipo)))
const isAdmin = computed(() => !!lab.value && roleKey(lab.value.rol_equipo) === 'admin')

const requestKey = (s: Solicitud) => `${s.laboratorio_id}-${s.usuario_id}`
const memberKey = (member: Miembro) => `${member.laboratorio_id}-${member.usuario_id}`
const canManageMember = (member: Miembro) => isAdmin.value && member.usuario_id !== currentUserId.value

const currentUserId = computed(() => {
  const token = authHeaders().Authorization
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return String(payload.user?.id_usuario || payload.id_usuario || '')
  } catch {
    return ''
  }
})

/* ============================================================
   Resumen del laboratorio (tarjetas de información y progreso)
   ============================================================ */
const infoCards = computed<InfoCard[]>(() => {
  const l = labData.value
  const f = factData.value
  const entrega = ENTREGA_OPTS.find(o => o.value === l.entrega_elementos)?.label
  const acreditado = !!l.acreditado && l.acreditado !== 'no'
  const calle = [l.calle, has(l.no_ext) && `No. ${l.no_ext}`, has(l.no_int) && `Int. ${l.no_int}`]
    .filter(Boolean)
    .join(' ')
  const metodoPago = METODO_PAGO_OPTS.find(o => o.value === f.metodo_pago)?.label

  return [
    {
      key: 'contacto',
      title: 'Contacto',
      icon: 'bi bi-person-lines-fill',
      tab: 'lab',
      rows: [
        { label: 'Correo principal', value: show(l.correo_1) },
        { label: 'Correo alterno', value: show(l.correo_2) },
        { label: 'Teléfono técnico', value: show(l.tel_tecnico) },
        { label: 'Teléfono fijo', value: show(l.tel_fijo) }
      ]
    },
    {
      key: 'direccion',
      title: 'Dirección',
      icon: 'bi bi-geo-alt',
      tab: 'lab',
      rows: [
        { label: 'Calle y número', value: show(calle) },
        { label: 'Colonia', value: show(l.colonia) },
        { label: 'Código postal', value: show(l.cp) },
        { label: 'Municipio / Delegación', value: show([l.municipio, l.delegacion].filter(has).join(' · ')) },
        { label: 'Estado', value: show(l.estado) }
      ]
    },
    {
      key: 'operacion',
      title: 'Operación y acreditación',
      icon: 'bi bi-patch-check',
      tab: 'lab',
      rows: [
        { label: 'Entrega de ítems', value: show(entrega) },
        { label: 'Acreditación', value: acreditadoLabel(l.acreditado) },
        ...(acreditado
          ? [
              { label: 'Especificación', value: show(l.a_especificacion) },
              { label: 'Número de acreditación', value: show(l.a_numero), mono: true }
            ]
          : [])
      ]
    },
    {
      key: 'facturacion',
      title: 'Facturación',
      icon: 'bi bi-receipt',
      tab: 'facturacion',
      wide: true,
      rows: [
        { label: 'Razón social', value: show(f.razon_social) },
        { label: 'RFC', value: show(f.rfc), mono: true },
        { label: 'Régimen fiscal', value: show(f.regimen_fiscal) },
        { label: 'Uso del CFDI', value: show(f.cfdi) },
        { label: 'Método de pago', value: show(metodoPago) },
        { label: 'Forma de pago', value: show(f.forma_pago) },
        { label: 'Institución bancaria', value: show(f.institucion_bancaria) },
        { label: 'Cuenta o CLABE', value: maskAccount(f.cuenta_clabe), mono: true },
        { label: 'Correo de facturación', value: show(f.correo_1) }
      ]
    }
  ]
})

const profileChecks = computed<ProfileCheck[]>(() => {
  const l = labData.value
  const f = factData.value
  return [
    { key: 'id', label: 'Identificación', done: has(l.nombre) && has(l.correo_1), tab: 'lab' },
    { key: 'tel', label: 'Teléfono de contacto', done: has(l.tel_tecnico) || has(l.tel_fijo), tab: 'lab' },
    { key: 'dir', label: 'Dirección', done: has(l.calle) && has(l.cp) && has(l.municipio) && has(l.estado), tab: 'lab' },
    { key: 'fact', label: 'Datos de facturación', done: has(f.razon_social) && has(f.rfc), tab: 'facturacion' }
  ]
})
const profileDone = computed(() => profileChecks.value.filter(c => c.done).length)
const profilePercent = computed(() => Math.round((profileDone.value / profileChecks.value.length) * 100))

// Cambia de paso en el asistente limpiando los errores del paso anterior
const goTo = (step: WizardStep) => {
  joinError.value = ''
  clearErrors(createErrors)
  wizardStep.value = step
}

const copyId = async () => {
  if (!lab.value) return
  try {
    await navigator.clipboard.writeText(String(lab.value.laboratorio_id))
    showToast('Compártelo con quien quieras que se una a tu equipo', 'success', 'ID copiado')
  } catch {
    showToast('No se pudo copiar el ID', 'error', 'Copiar')
  }
}

/* ============================================================
   Agregar miembro por correo (solo administrador)
   ============================================================ */
type LookupStatus = 'idle' | 'invalid' | 'searching' | 'found' | 'notfound' | 'taken' | 'member' | 'error'
interface FoundUser { usuario_id: string; correo: string; fullName: string }

const newMemberEmail = ref('')
const newMemberRole = ref('miembro')
const addingMember = ref(false)
const lookup = reactive<{ status: LookupStatus; user: FoundUser | null; error: string }>({ status: 'idle', user: null, error: '' })
let lookupTimer: ReturnType<typeof setTimeout> | null = null
let lookupSeq = 0 // descarta respuestas de búsquedas anteriores

const resetLookup = (status: LookupStatus = 'idle') => {
  lookup.status = status
  lookup.user = null
  lookup.error = ''
}

const lookupMessage = computed(() => {
  switch (lookup.status) {
    case 'invalid': return 'Escribe un correo electrónico válido.'
    case 'notfound': return 'No hay ningún usuario registrado con ese correo.'
    case 'taken': return 'Ese usuario ya pertenece a otro laboratorio.'
    case 'member': return 'Ese usuario ya es miembro de tu laboratorio.'
    case 'error': return lookup.error || 'No se pudo buscar al usuario.'
    case 'found': return 'Usuario encontrado.'
    default: return ''
  }
})
const lookupIcon = computed(() => (lookup.status === 'found' ? 'bi bi-check-circle' : 'bi bi-info-circle'))

const searchUserByEmail = async (correo: string) => {
  const seq = ++lookupSeq
  lookup.status = 'searching'
  lookup.user = null
  const current = lab.value
  if (!current) return
  try {
    // Se asume: GET .../miembros/buscar?correo= → { data: usuario } (404 si no existe) y data.laboratorio_id si ya tiene laboratorio
    const body = await requestJson(
      `${api.value}/api/laboratorios/${current.laboratorio_id}/miembros/buscar?correo=${encodeURIComponent(correo)}`,
      { headers: { ...authHeaders() } }
    )
    if (seq !== lookupSeq) return
    const u = body.data
    if (!u || String(u.correo || '').toLowerCase() !== correo.toLowerCase()) return resetLookup('notfound')
    if (miembros.value.some(m => String(m.usuario_id) === String(u.usuario_id ?? u.id_usuario))) return resetLookup('member')
    if (u.laboratorio_id && Number(u.laboratorio_id) !== current.laboratorio_id) return resetLookup('taken')
    lookup.status = 'found'
    lookup.user = {
      usuario_id: String(u.usuario_id ?? u.id_usuario),
      correo: u.correo,
      fullName: `${u.nombre || ''} ${u.primer_apellido || ''} ${u.segundo_apellido || ''}`.trim() || u.correo
    }
  } catch (err) {
    if (seq !== lookupSeq) return
    if (/HTTP 404/.test(errorMessage(err))) return resetLookup('notfound')
    lookup.status = 'error'
    lookup.error = errorMessage(err)
  }
}

// Espera a que termine de escribir; solo busca si el correo tiene formato válido
watch(newMemberEmail, (value) => {
  if (lookupTimer) clearTimeout(lookupTimer)
  lookupSeq++
  if (!value) return resetLookup()
  if (!isEmail(value)) {
    // No molesta mientras escribe: el aviso aparece tras una breve pausa
    resetLookup()
    lookupTimer = setTimeout(() => { if (!isEmail(newMemberEmail.value)) resetLookup('invalid') }, 700)
    return
  }
  lookup.status = 'searching'
  lookupTimer = setTimeout(() => searchUserByEmail(value), 400)
})

const addMember = async () => {
  const current = lab.value
  if (!current || lookup.status !== 'found' || !lookup.user || addingMember.value) return
  addingMember.value = true
  try {
    await requestJson(`${api.value}/api/laboratorios/${current.laboratorio_id}/miembros`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ usuario_id: lookup.user.usuario_id, correo: lookup.user.correo, rol_equipo: newMemberRole.value })
    })
    showToast(`${lookup.user.fullName} ahora forma parte de tu laboratorio`, 'success', 'Miembro agregado')
    newMemberEmail.value = ''
    newMemberRole.value = 'miembro'
    resetLookup()
    await loadLabDetail()
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo agregar al miembro')
  } finally {
    addingMember.value = false
  }
}

const updateMemberRole = async (member: Miembro, rolEquipo: string) => {
  if (rolEquipo === roleKey(member.rol_equipo) || updatingMember.value) return
  updatingMember.value = memberKey(member)
  try {
    await requestJson(`${api.value}/api/laboratorios/${member.laboratorio_id}/miembros/${member.usuario_id}/rol`, {
      method: 'PATCH',
      headers: jsonHeaders(),
      body: JSON.stringify({ rol_equipo: rolEquipo })
    })
    member.rol_equipo = rolEquipo
    showToast(`El rol de ${member.fullName} fue actualizado`, 'success', 'Rol actualizado')
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo actualizar el rol')
  } finally {
    updatingMember.value = null
  }
}

// Una sola petición trae los datos completos, la facturación y el equipo del laboratorio
const loadLabDetail = async () => {
  const current = lab.value
  if (!current || esSolicitudPendiente(current)) {
    labDetail.value = null
    miembros.value = []
    return
  }
  membersLoading.value = true
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/${current.laboratorio_id}`, {
      headers: { ...authHeaders() }
    })
    const data = body.data || {}
    labDetail.value = { laboratorio: data.laboratorio, facturacion: data.facturacion }
    miembros.value = (data.equipo || []).map((member: any) => {
      const fullName = `${member.nombre || ''} ${member.primer_apellido || ''} ${member.segundo_apellido || ''}`.trim() || 'Miembro del laboratorio'
      return { ...member, laboratorio_id: current.laboratorio_id, fullName } as Miembro
    })
  } catch (err) {
    labDetail.value = null
    miembros.value = []
    console.error('load lab detail error', err)
    showToast(errorMessage(err), 'error', 'No se pudo cargar la información del laboratorio')
  } finally {
    membersLoading.value = false
  }
}

/* ============================================================
   Carga
   ============================================================ */
const load = async () => {
  loading.value = true
  try {
    const body = await requestJson(`${api.value}/api/laboratorios/mis`, { headers: { ...authHeaders() } })
    labs.value = body.data || []
    await loadLabDetail()
    if (isAdminOrTech.value) await loadSolicitudes()
    else solicitudes.value = []
    // Después de cargar el laboratorio, verificar si tiene datos incompletos
    checkIncompleteLabs()
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

// Revisa la lista de labs y abre el modal obligatorio si hay alguno incompleto.
const checkIncompleteLabs = () => {
  try {
    if (!labs.value || labs.value.length === 0) return
    const incompletos = labs.value.filter(l => isLabIncomplete(l))
    if (incompletos.length === 0) {
      showMandatoryModal.value = false
      return
    }
    // Preferir uno que el usuario pueda editar
    const editable = incompletos.find(l => canEdit(l)) || incompletos[0]
    // Abrir modal con ese laboratorio
    selectedLab.value = { ...editable }
    Object.keys(labForm).forEach(k => delete labForm[k])
    Object.assign(labForm, editable || {})
    if (!labForm.acreditado) labForm.acreditado = 'no'
    if (!labForm.entrega_elementos) labForm.entrega_elementos = 'instalaciones_sena'
    activeTab.value = 'lab'
    showModal.value = true
    showMandatoryModal.value = true
  } catch (err) {
    console.error('checkIncompleteLabs error', err)
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

const reenviarSolicitud = () => {
  if (lab.value) void solicitarAlLaboratorio(lab.value.laboratorio_id)
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
const viewLab = async (l: Laboratorio, tab: TabKey = 'lab') => {
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
    activeTab.value = tab
    showModal.value = true
    // Si este laboratorio tiene datos incompletos, marcar como obligatorio
    if (isLabIncomplete(selectedLab.value || l)) {
      showMandatoryModal.value = true
      activeTab.value = 'lab'
    } else {
      showMandatoryModal.value = false
    }
  } catch (err) {
    showToast(errorMessage(err), 'error', 'No se pudo abrir')
  } finally {
    opening.value = null
  }
}

// Abre el modal del laboratorio del usuario en la pestaña indicada
const openEdit = (tab: TabKey = 'lab') => {
  if (lab.value) void viewLab(lab.value, tab)
}

const closeModal = () => {
  if (saving.value) return
  // Si es un modal obligatorio y los datos siguen incompletos, no permitir cerrar
  if (showMandatoryModal.value && selectedLab.value && isLabIncomplete(selectedLab.value) && !labIsComplete.value) {
    showToast('Debes completar los campos obligatorios del laboratorio antes de cerrar.', 'warning')
    return
  }
  showModal.value = false
  selectedLab.value = null
  showMandatoryModal.value = false
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

// Comprueba si un laboratorio tiene campos obligatorios vacíos
const getLabVal = (l: any, keys: string[]) => {
  for (const k of keys) {
    if (l == null) continue
    if (k in l && l[k] != null) return String(l[k]).trim()
  }
  return ''
}

const isLabIncomplete = (l: any) => {
  if (!l) return false
  const nombre = getLabVal(l, ['nombre', 'nombre_lab', 'laboratorio_nombre', 'empresa'])
  const correo = getLabVal(l, ['correo_1', 'email', 'correo', 'contacto_email'])
  if (!nombre) return true
  if (!correo) return true
  const acreditado = getLabVal(l, ['acreditado'])
  if (acreditado && acreditado !== 'no') {
    const espec = getLabVal(l, ['a_especificacion', 'acreditacion_especificacion'])
    const num = getLabVal(l, ['a_numero', 'acreditacion_numero'])
    if (!espec || !num) return true
  }
  return false
}

// Comprueba si el formulario actual del modal contiene los campos obligatorios válidos
const labIsComplete = computed(() => {
  if (!labForm) return false
  if (!labForm.nombre) return false
  if (!labForm.correo_1 || !isEmail(labForm.correo_1)) return false
  if (labForm.acreditado && labForm.acreditado !== 'no') {
    if (!labForm.a_especificacion || !labForm.a_numero) return false
  }
  return true
})

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
    // Re-evaluar si todavía hay laboratorios incompletos
    checkIncompleteLabs()
    showToast('Los datos del laboratorio se guardaron', 'success', 'Guardado')
    // Si ya no hay requerimientos obligatorios, cerrar; si no, dejar el modal abierto
    if (!showMandatoryModal.value) closeModal()
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
    // Refresca el resumen para que la tarjeta de facturación muestre lo guardado
    await loadLabDetail()
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
  // Prefill form when navigated from dashboard invite modal
  // (siempre se pregunta primero la situación). El nombre de la persona NO se usa como nombre
  // del laboratorio: ahí se muestra el ejemplo del placeholder.
  try {
    const q = route.query || {}
    if (q.correo) form.correo_1 = String(q.correo)
  } catch (e) {
    /* ignore */
  }
  void load()
})

onBeforeUnmount(() => {
  if (lookupTimer) clearTimeout(lookupTimer)
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
  color: var(--sena-text);
}

.mono { font-family: var(--font-mono); }

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
.btn-lg { padding: 0.85rem 1.5rem; font-size: 0.95rem; }
.btn-block { width: 100%; }

.icon-btn {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--sena-border);
  border-radius: 10px;
  background: transparent;
  color: var(--sena-muted);
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition);
}
.icon-btn:hover:not(:disabled) { background: var(--sena-green-pale); border-color: var(--sena-green-light); color: var(--sena-green); }
.icon-btn:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
  position: relative;
  padding: 2.75rem 0 1.75rem;
  background:
    radial-gradient(600px 220px at 85% -20%, rgba(122, 171, 61, 0.22), transparent 70%),
    linear-gradient(180deg, var(--sena-green-pale) 0%, transparent 100%);
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

.stack { display: flex; flex-direction: column; gap: 1.25rem; }

/* ============================================================
   SECCIONES
   ============================================================ */
.section + .section { margin-top: 2.75rem; }
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
.count-pill-warn { color: var(--tone-warn); background: var(--tone-warn-bg); border-color: transparent; }

/* ============================================================
   ASISTENTE (sin laboratorio)
   ============================================================ */
.wizard { max-width: 680px; margin: 0 auto; }

.stepper {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.stepper-item { display: inline-flex; align-items: center; gap: 0.55rem; color: var(--sena-muted); }
.stepper-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--surface);
  border: 1.5px solid var(--sena-border);
  transition: var(--transition);
}
.stepper-label { font-size: 0.82rem; font-weight: 600; }
.stepper-item.active { color: var(--sena-text); }
.stepper-item.active .stepper-dot {
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  border-color: transparent;
  color: #fff;
  box-shadow: var(--shadow-green);
}
.stepper-item.done .stepper-dot { background: var(--sena-green-pale); border-color: var(--sena-green-light); color: var(--sena-green); }
.stepper-item.done { color: var(--sena-text); }
.stepper-line { width: 56px; height: 2px; border-radius: 2px; background: var(--sena-border); transition: var(--transition); }
.stepper-line.filled { background: var(--sena-green-light); }

.step-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
}
.step-hero { text-align: center; }
.step-hero h2 { font-family: var(--font-display); font-size: 1.65rem; margin: 0 0 0.5rem; }
.step-hero p { color: var(--sena-muted); font-size: 0.95rem; line-height: 1.6; margin: 0 auto; max-width: 46ch; }
.empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--sena-green);
  background: var(--sena-green-pale);
}

.choice-grid { display: grid; grid-template-columns: 1fr; gap: 0.85rem; }
.choice-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.1rem 1.25rem;
  text-align: left;
  font-family: inherit;
  color: var(--sena-text);
  background: var(--surface-alt);
  border: 1.5px solid var(--sena-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: var(--transition);
}
.choice-card:hover {
  border-color: var(--sena-green-light);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.choice-card:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.choice-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--sena-green);
  background: var(--sena-green-pale);
}
.choice-text { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.choice-text strong { font-size: 1rem; }
.choice-text small { color: var(--sena-muted); font-size: 0.8rem; }
.choice-arrow { color: var(--sena-green); font-size: 1.1rem; transition: var(--transition); }
.choice-card:hover .choice-arrow { transform: translateX(4px); }

.back-link {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0;
  border: none;
  background: transparent;
  color: var(--sena-muted);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.back-link:hover { color: var(--sena-green); }

.step-head { display: flex; align-items: center; gap: 0.9rem; }
.step-title { font-family: var(--font-display); font-size: 1.4rem; margin: 0; }
.step-sub { margin: 0.15rem 0 0; font-size: 0.85rem; color: var(--sena-muted); }
.step-alt { margin: 0; text-align: center; font-size: 0.82rem; color: var(--sena-muted); }
.link-btn {
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  color: var(--sena-green);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
[data-bs-theme="dark"] .link-btn { color: var(--sena-green-light); }

.panel-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  flex-shrink: 0;
}

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

/* Transición entre pasos */
.step-enter-active,
.step-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.step-enter-from { opacity: 0; transform: translateX(18px); }
.step-leave-to { opacity: 0; transform: translateX(-18px); }

/* ============================================================
   PANELES (skeleton de carga)
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
.hero-skeleton { min-height: 130px; }

/* ============================================================
   TU LABORATORIO: tarjeta principal
   ============================================================ */
.lab-hero {
  position: relative;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
}
.lab-hero::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 5px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
}
.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1.9rem 1.75rem 1.5rem;
}
.hero-main { display: flex; align-items: center; gap: 1.1rem; min-width: 0; flex: 1 1 340px; }
.lab-avatar {
  width: 48px;
  height: 48px;
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
.lab-avatar-lg { width: 76px; height: 76px; border-radius: 22px; font-size: 1.5rem; box-shadow: var(--shadow-green); }
.hero-info { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem; }
.hero-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.hero-name {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
  overflow-wrap: anywhere;
}
.id-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.28rem 0.7rem;
  border: 1px dashed var(--sena-border);
  border-radius: 999px;
  background: var(--surface-alt);
  color: var(--sena-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
}
.id-chip:hover { border-color: var(--sena-green-light); color: var(--sena-text); }
.id-chip:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.id-hint { font-size: 0.78rem; color: var(--sena-muted); }
.id-box {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  max-width: 100%;
  margin: 0.35rem 0 0.25rem;
  padding: 0.55rem 0.6rem 0.55rem 1rem;
  border: 2px solid var(--sena-green-light);
  border-radius: 14px;
  background: var(--sena-green-pale);
}
.id-box-text { display: flex; flex-direction: column; line-height: 1.1; min-width: 0; }
.id-box-label {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sena-green);
}
.id-box-value {
  font-family: var(--font-mono);
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--sena-text);
  overflow-wrap: anywhere;
}
.id-box-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 0;
  border-radius: 10px;
  background: var(--sena-green);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.id-box-copy:hover { filter: brightness(1.1); }
.id-box-copy:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.hero-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  border-top: 1px solid var(--sena-border);
  background: var(--surface-alt);
}
.stat { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.75rem; }
.stat + .stat { border-left: 1px solid var(--sena-border); }
.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  flex-shrink: 0;
}
.stat-icon-warn { background: var(--tone-warn-bg); color: var(--tone-warn); }
.stat-value { font-size: 1.3rem; font-weight: 700; line-height: 1.1; }
.stat-label { font-size: 0.72rem; color: var(--sena-muted); }

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

/* Progreso del perfil */
.completeness {
  padding: 1.1rem 1.35rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-left: 4px solid var(--sena-green-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.completeness-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.7rem; }
.completeness-head strong { display: block; font-size: 0.95rem; }
.completeness-head span { font-size: 0.78rem; color: var(--sena-muted); }
.completeness-pct { font-size: 1.4rem; font-weight: 700; color: var(--sena-green); }
[data-bs-theme="dark"] .completeness-pct { color: var(--sena-green-light); }
.progress { height: 8px; border-radius: 999px; background: var(--sena-green-pale); overflow: hidden; }
.progress > span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--sena-green), var(--sena-green-light));
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.check-list { list-style: none; margin: 0.9rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.check-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border: 1.5px dashed var(--sena-green-light);
  border-radius: 999px;
  background: transparent;
  color: var(--sena-text);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.check-chip:hover:not(:disabled) { background: var(--sena-green-pale); }
.check-chip:focus-visible { outline: 3px solid rgba(122, 171, 61, 0.45); outline-offset: 2px; }
.check-chip.done {
  border-style: solid;
  border-color: transparent;
  background: var(--tone-ok-bg);
  color: var(--tone-ok);
  cursor: default;
}
.check-chip:disabled:not(.done) { opacity: 0.55; cursor: not-allowed; }

/* Tarjetas de información */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}
.info-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  padding: 1.35rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.info-card:hover { box-shadow: var(--shadow-md); border-color: var(--sena-green-light); }
.info-card-wide { grid-column: 1 / -1; }
.info-card-head { display: flex; align-items: center; gap: 0.7rem; }
.info-card-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  background: var(--sena-green-pale);
  color: var(--sena-green);
  flex-shrink: 0;
}
.info-card-title { flex: 1; min-width: 0; margin: 0; font-size: 1rem; font-weight: 700; }
.info-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.9rem 1.25rem;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px dashed var(--sena-border);
}
.info-row { min-width: 0; }
.info-row dt {
  font-size: 0.66rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sena-muted);
}
.info-row dd { margin: 0.2rem 0 0; font-size: 0.88rem; font-weight: 500; overflow-wrap: anywhere; }
.info-row dd.mono { letter-spacing: 0.04em; }
.info-row dd.is-empty { color: var(--sena-muted); opacity: 0.6; font-weight: 400; }

/* Solicitud pendiente */
.pending-panel {
  max-width: 620px;
  margin: 1rem auto 0;
  padding: 2.25rem 2rem;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-top: 5px solid var(--tone-warn);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
}
.pending-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: var(--tone-warn-bg);
  color: var(--tone-warn);
}
.pending-title { font-family: var(--font-display); font-size: 1.5rem; margin: 0 0 0.5rem; }
.pending-text { color: var(--sena-muted); font-size: 0.92rem; line-height: 1.6; margin: 0 auto 1.5rem; max-width: 46ch; }
.pending-text strong { color: var(--sena-text); }
.pending-actions { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }

/* ============================================================
   MIEMBROS
   ============================================================ */
.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1rem;
}
.member-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  min-width: 0;
  padding: 1rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--sena-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.member-card:hover { box-shadow: var(--shadow-md); border-color: var(--sena-green-light); }
.member-card.is-skeleton { min-height: 92px; align-content: center; }
.sk-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 50%;
}
.member-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, var(--sena-green), var(--sena-green-light));
  font-weight: 700;
  font-size: 0.82rem;
}
.member-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.16rem; }
.member-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.member-contact {
  color: var(--sena-muted);
  font-size: 0.72rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.member-contact i { color: var(--sena-green-light); }
.member-role-control { flex-basis: 100%; }
.member-role-select {
  width: 100%;
  padding: 0.42rem 0.55rem;
  border: 1px solid var(--sena-border);
  border-radius: 8px;
  background: var(--surface-alt);
  color: var(--sena-text);
  font-family: var(--font-body);
  font-size: 0.76rem;
}
.member-role-select:focus { outline: none; border-color: var(--sena-green-light); box-shadow: 0 0 0 3px rgba(122, 171, 61, 0.18); }
.member-role-select:disabled { cursor: wait; opacity: 0.7; }

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
.request-actions { display: flex; gap: 0.5rem; }

/* Agregar miembro por correo */
.add-member {
  margin-bottom: 1.25rem;
  padding: 1.1rem 1.25rem;
  border: 1.5px dashed var(--sena-green-light);
  border-radius: 14px;
  background: var(--sena-green-pale);
}
.add-member .field-label { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.6rem; }
.add-member-row { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.add-member-input { position: relative; flex: 1 1 260px; }
.add-member-input .field-input { width: 100%; }
.add-member-spin { position: absolute; right: 0.8rem; top: 50%; width: 16px; height: 16px; margin-top: -8px; border-width: 2px; }
.add-member-role { flex: 0 0 auto; min-width: 150px; }
.add-member-msg { display: flex; align-items: center; gap: 0.4rem; margin: 0.6rem 0 0; font-size: 0.82rem; color: var(--sena-muted); }
.add-member-msg.is-invalid,
.add-member-msg.is-error { color: #b02a37; }
.add-member-msg.is-found { color: var(--sena-green); font-weight: 600; }
.found-user {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.8rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--sena-green-light);
  border-radius: 12px;
  background: var(--surface, #fff);
}
.found-user .member-info { flex: 1 1 180px; min-width: 0; }

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

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ============================================================
   CAMPOS
   ============================================================ */
.field { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
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
.field-input-lg { padding: 0.85rem 1rem; font-size: 1.05rem; border-radius: 12px; }
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

.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 1rem; }
.span-2 { grid-column: span 2; }

/* ============================================================
   MODAL
   ============================================================ */
.ml-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
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
.ml-modal-close:disabled { opacity: 0.5; cursor: not-allowed; }

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
.alert-inline.alert-warn { background: var(--tone-warn-bg); border-color: transparent; color: var(--tone-warn); }
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
  .form-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
  .request-actions { width: 100%; }
  .request-actions .btn { flex: 1; }
  .step-card { padding: 1.35rem; }
  .stepper-line { width: 32px; }
  .hero-top { padding: 1.6rem 1.2rem 1.2rem; }
  .hero-actions { width: 100%; }
  .hero-actions .btn { flex: 1; }
  .hero-stats { grid-template-columns: 1fr; }
  .stat { padding: 0.85rem 1.2rem; }
  .stat + .stat { border-left: none; border-top: 1px solid var(--sena-border); }
  .info-grid { grid-template-columns: 1fr; }
  .pending-panel { padding: 1.75rem 1.25rem; }
}
@media (max-width: 576px) {
  .stepper-label { display: none; }
  .stepper-item.active .stepper-label { display: inline; }
  .hero-main { flex-direction: column; align-items: flex-start; }
  .ml-overlay { padding: 0; align-items: flex-end; }
  .ml-modal { max-height: 94vh; border-radius: 22px 22px 0 0; }
  .footer-note { display: none; }
  .footer-actions { width: 100%; }
  .footer-actions .btn { flex: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sk, .spinner { animation: none; }
  .step-enter-active, .step-leave-active, .progress > span { transition: none; }
  .btn-primary:hover:not(:disabled),
  .choice-card:hover { transform: none; }
}
</style>
