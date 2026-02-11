// Catálogo de emojis amplio y organizado — colección extensa de emojis para usar como iconos
const ICON_CATALOG = [
  // Emociones / Personas
  { value: '😀', label: 'Sonriente' },
  { value: '😃', label: 'Feliz' },
  { value: '😄', label: 'Muy feliz' },
  { value: '😁', label: 'Sonrisa grande' },
  { value: '😆', label: 'Riendo' },
  { value: '😅', label: 'Aliviado' },
  { value: '😂', label: 'Llorando de risa' },
  { value: '🙂', label: 'Leve sonrisa' },
  { value: '😉', label: 'Guiño' },
  { value: '😊', label: 'Agradecido' },
  { value: '😇', label: 'Angelical' },

  // Personas / roles
  { value: '👨‍🔬', label: 'Científico' },
  { value: '👩‍🔬', label: 'Científica' },
  { value: '👨‍🏫', label: 'Profesor' },
  { value: '👩‍🏫', label: 'Profesora' },
  { value: '👨‍💻', label: 'Desarrollador' },
  { value: '👩‍💻', label: 'Desarrolladora' },

  // Ciencia / Laboratorio (priorizados)
  { value: '🧪', label: 'Química / Ensayos' },
  { value: '⚗️', label: 'Alembic / Tubo de ensayo' },
  { value: '🔬', label: 'Microscopio' },
  { value: '🧬', label: 'ADN / Molécula' },
  { value: '🧫', label: 'Placa Petri' },
  { value: '💧', label: 'Gota / Dispensador' },
  { value: '💊', label: 'Fármaco / Píldora' },
  { value: '💉', label: 'Jeringa' },
  { value: '🧤', label: 'Guantes' },
  { value: '🥽', label: 'Gafas' },
  { value: '🥼', label: 'Bata' },
  { value: '🔥', label: 'Inflamable / Calor' },
  { value: '🗑️', label: 'Desechos químicos' },

  // Naturaleza / Animales
  { value: '🌱', label: 'Planta' },
  { value: '🌿', label: 'Hojas' },
  { value: '🌷', label: 'Flor' },
  { value: '🌳', label: 'Árbol' },
  { value: '🐶', label: 'Perro' },
  { value: '🐱', label: 'Gato' },
  { value: '🐭', label: 'Ratón' },
  { value: '🐹', label: 'Hámster' },
  { value: '🐰', label: 'Conejo' },
  { value: '🦊', label: 'Zorro' },
  { value: '🐻', label: 'Oso' },

  // Comida y bebida
  { value: '🍎', label: 'Manzana' },
  { value: '🍌', label: 'Banana' },
  { value: '🍇', label: 'Uvas' },
  { value: '🍉', label: 'Sandía' },
  { value: '🍓', label: 'Fresa' },
  { value: '🍔', label: 'Hamburguesa' },
  { value: '🍕', label: 'Pizza' },
  { value: '🍣', label: 'Sushi' },
  { value: '☕', label: 'Café' },
  { value: '🍺', label: 'Cerveza' },

  // Objetos / Herramientas
  { value: '🔧', label: 'Llave inglesa' },
  { value: '🔨', label: 'Martillo' },
  { value: '🛠️', label: 'Herramientas' },
  { value: '⚙️', label: 'Configuración' },
  { value: '🧰', label: 'Caja de herramientas' },

  // Comunicación / Documentos
  { value: '📚', label: 'Documentación' },
  { value: '📁', label: 'Archivo' },
  { value: '📄', label: 'Documento' },
  { value: '🧾', label: 'Recibo / Reporte' },
  { value: '✉️', label: 'Correo' },
  { value: '📞', label: 'Teléfono' },

  // Negocios / UI
  { value: '📈', label: 'Crecimiento' },
  { value: '📉', label: 'Descenso' },
  { value: '📊', label: 'Gráficos' },
  { value: '💼', label: 'Trabajo / Portafolio' },
  { value: '💳', label: 'Pagos' },
  { value: '✅', label: 'Aprobado' },
  { value: '❌', label: 'Rechazado' },
  { value: '➕', label: 'Agregar' },
  { value: '➖', label: 'Eliminar' },
  { value: '✏️', label: 'Editar' },

  // Transporte / ubicaciones
  { value: '🚗', label: 'Auto' },
  { value: '🚚', label: 'Camión' },
  { value: '✈️', label: 'Avión' },
  { value: '🚆', label: 'Tren' },
  { value: '📍', label: 'Ubicación' },
  { value: '🗺️', label: 'Mapa' },

  // Símbolos / utilidad
  { value: '🔎', label: 'Buscar' },
  { value: '🔔', label: 'Notificaciones' },
  { value: '🔒', label: 'Bloquear' },
  { value: '⚠️', label: 'Advertencia' },
  { value: '⏳', label: 'En espera' },
  { value: '⏱️', label: 'Temporizador' }
  ,
  // --- Caritas y emociones ---
  { value: '😃', label: 'Sonrisa grande' },
  { value: '😄', label: 'Sonriente 2' },
  { value: '😁', label: 'Dentón' },
  { value: '😆', label: 'Risa' },
  { value: '😂', label: 'Llorando de risa' },
  { value: '🙂', label: 'Leve sonrisa' },
  { value: '😉', label: 'Guiño' },
  { value: '😍', label: 'Amor' },
  { value: '😘', label: 'Beso' },
  { value: '😜', label: 'Sacar lengua' },
  { value: '😎', label: 'Cool' },
  { value: '🤓', label: 'Nerd' },
  { value: '😴', label: 'Dormido' },
  { value: '😢', label: 'Triste' },
  { value: '😭', label: 'Llorando' },
  { value: '😡', label: 'Enojado' },
  { value: '😱', label: 'Sorpresa' },

  // --- Personas y roles ---
  { value: '👨‍🔬', label: 'Científico' },
  { value: '👩‍🔬', label: 'Científica' },
  { value: '👨‍⚕️', label: 'Médico' },
  { value: '👩‍⚕️', label: 'Médica' },
  { value: '👨‍🏫', label: 'Profesor' },
  { value: '👩‍🏫', label: 'Profesora' },
  { value: '👨‍💻', label: 'Desarrollador' },
  { value: '👩‍💻', label: 'Desarrolladora' },
  { value: '👨‍🔧', label: 'Técnico' },
  { value: '👩‍🔧', label: 'Técnica' },

  // --- Naturaleza y clima ---
  { value: '☀️', label: 'Sol' },
  { value: '🌤️', label: 'Parcialmente nublado' },
  { value: '⛅', label: 'Nublado' },
  { value: '🌧️', label: 'Lluvia' },
  { value: '⛈️', label: 'Tormenta' },
  { value: '❄️', label: 'Nieve' },
  { value: '🌪️', label: 'Tornado' },
  { value: '🌈', label: 'Arcoíris' },

  // --- Animales ---
  { value: '🐶', label: 'Perro' },
  { value: '🐱', label: 'Gato' },
  { value: '🐭', label: 'Ratón' },
  { value: '🐹', label: 'Hámster' },
  { value: '🐰', label: 'Conejo' },
  { value: '🦊', label: 'Zorro' },
  { value: '🐻', label: 'Oso' },
  { value: '🐼', label: 'Panda' },
  { value: '🐨', label: 'Koala' },
  { value: '🐯', label: 'Tigre' },
  { value: '🦁', label: 'León' },
  { value: '🐮', label: 'Vaca' },
  { value: '🐷', label: 'Cerdo' },

  // --- Frutas y comida ---
  { value: '🍎', label: 'Manzana' },
  { value: '🍊', label: 'Naranja' },
  { value: '🍌', label: 'Banana' },
  { value: '🍉', label: 'Sandía' },
  { value: '🍇', label: 'Uvas' },
  { value: '🍓', label: 'Fresa' },
  { value: '🍒', label: 'Cereza' },
  { value: '🍍', label: 'Piña' },
  { value: '🍔', label: 'Hamburguesa' },
  { value: '🍕', label: 'Pizza' },
  { value: '🍣', label: 'Sushi' },
  { value: '🍩', label: 'Donut' },

  // --- Bebidas ---
  { value: '☕', label: 'Café' },
  { value: '🍵', label: 'Té' },
  { value: '🥤', label: 'Bebida' },
  { value: '🍺', label: 'Cerveza' },
  { value: '🍷', label: 'Vino' },

  // --- Objetos de oficina / tech ---
  { value: '💻', label: 'Laptop' },
  { value: '🖥️', label: 'Monitor' },
  { value: '🖨️', label: 'Impresora' },
  { value: '📱', label: 'Móvil' },
  { value: '⌚', label: 'Reloj' },

  // --- Transporte ---
  { value: '🚗', label: 'Auto' },
  { value: '🚕', label: 'Taxi' },
  { value: '🚚', label: 'Camión' },
  { value: '🚲', label: 'Bicicleta' },
  { value: '✈️', label: 'Avión' },
  { value: '🚆', label: 'Tren' },

  // --- Señales y símbolos ---
  { value: '✅', label: 'Aprobado' },
  { value: '❌', label: 'Rechazado' },
  { value: '⚠️', label: 'Advertencia' },
  { value: 'ℹ️', label: 'Información' },
  { value: '🔒', label: 'Bloqueado' },
  { value: '🔓', label: 'Desbloqueado' },

  // --- Medallas / logros ---
  { value: '🏅', label: 'Medalla' },
  { value: '🥇', label: 'Oro' },
  { value: '🥈', label: 'Plata' },
  { value: '🥉', label: 'Bronce' },

  // --- Misceláneo adicional ---
  { value: '📌', label: 'Fijar' },
  { value: '📎', label: 'Adjuntar' },
  { value: '🗂️', label: 'Carpeta' },
  { value: '📅', label: 'Calendario' },
  { value: '🧭', label: 'Navegación' },
  { value: '🔍', label: 'Buscar 2' },
  { value: '🎯', label: 'Objetivo' },
  { value: '🎓', label: 'Graduación' }
]

export default ICON_CATALOG

