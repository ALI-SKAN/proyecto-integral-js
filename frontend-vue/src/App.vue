<script setup>
import { ref, computed, onMounted } from 'vue'

// API relativa: mismo origen y puerto (servidor unificado 3001)
const API = '/api/consultas'

// Estado reactivo
const consultas = ref([])      // lista completa traída del servidor
const cargando = ref(false)
const error = ref('')

// Filtros en memoria
const filtroEstado = ref('todos')   // todos / pendiente / en proceso / resuelta
const busqueda = ref('')            // texto por nombre de estudiante o asunto

// Carga todas las consultas (GET) al montar
async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const res = await fetch(API)
    if (!res.ok) throw new Error('No se pudo obtener la lista')
    consultas.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

// Filtrado en memoria por estado + búsqueda de texto
const consultasFiltradas = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return consultas.value.filter(c => {
    const coincideEstado = filtroEstado.value === 'todos' || c.estado === filtroEstado.value
    const coincideTexto = !texto ||
      c.estudiante.toLowerCase().includes(texto) ||
      c.asunto.toLowerCase().includes(texto)
    return coincideEstado && coincideTexto
  })
})

// Elimina una consulta (DELETE) con confirmación
async function eliminar(id) {
  if (!confirm('¿Eliminar esta consulta?')) return
  error.value = ''
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('No se pudo eliminar')
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

// Carga inicial
onMounted(cargar)
</script>

<template>
  <!-- Barra de navegación común a las 4 funciones -->
  <nav class="nav">
    <span class="marca">Consultas Estudiantiles</span>
    <div class="enlaces">
      <a href="/registrar">Registrar</a>
      <a href="/editar">Editar</a>
      <a href="/filtrar" class="activo">Filtrar</a>
      <a href="/estado">Estado</a>
    </div>
  </nav>

  <div class="contenedor">
    <h1>Filtrar y listar consultas</h1>

    <!-- Controles de filtrado -->
    <div class="tarjeta filtros">
      <input v-model="busqueda" placeholder="Buscar por estudiante o asunto..." />
      <select v-model="filtroEstado">
        <option value="todos">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="en proceso">En proceso</option>
        <option value="resuelta">Resuelta</option>
      </select>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="cargando">Cargando...</p>

    <!-- Listado filtrado -->
    <ul class="lista">
      <li v-for="c in consultasFiltradas" :key="c.id" class="tarjeta">
        <div class="cabecera">
          <strong>{{ c.estudiante }}</strong>
          <span :class="['badge', c.estado.replace(' ', '-')]">{{ c.estado }}</span>
        </div>
        <p class="asunto">{{ c.asunto }}</p>
        <p class="mensaje">{{ c.mensaje }}</p>
        <div class="acciones">
          <button class="peligro" @click="eliminar(c.id)">Eliminar</button>
        </div>
      </li>
    </ul>
    <p v-if="!cargando && consultasFiltradas.length === 0">No hay consultas que coincidan.</p>
  </div>
</template>

<style>
/* Paleta compartida entre las 4 funciones */
body { font-family: system-ui, sans-serif; background: #f1f5f9; margin: 0; color: #1e293b; }

/* Barra de navegación superior con degradado */
.nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: .9rem 1.4rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
}
.nav .marca { font-weight: 700; }
.nav .enlaces { display: flex; gap: .4rem; }
.nav a { color: #fff; text-decoration: none; padding: .4rem .8rem; border-radius: 8px; }
.nav a:hover { background: rgba(255, 255, 255, .15); }
.nav a.activo { background: rgba(255, 255, 255, .25); }

.contenedor { max-width: 680px; margin: 0 auto; padding: 1.4rem; }
h1 { text-align: center; }

/* Tarjetas blancas */
.tarjeta {
  background: #fff; border-radius: 14px; padding: 1.1rem;
  margin-bottom: 1rem; box-shadow: 0 4px 20px rgba(15, 23, 42, .08);
}
.filtros { display: flex; gap: .6rem; }

/* Inputs y selects */
input, select {
  box-sizing: border-box; padding: .6rem;
  border: 1px solid #e2e8f0; border-radius: 10px; font: inherit;
  background: #fff; color: #1e293b;
}
.filtros input { flex: 1; }
input:focus, select:focus { outline: none; border-color: #6366f1; }

.lista { list-style: none; padding: 0; margin: 0; }
.cabecera { display: flex; justify-content: space-between; align-items: center; }
.asunto { font-weight: 600; margin: .5rem 0 .2rem; }
.mensaje { margin: 0 0 .7rem; color: #475569; }
.acciones { display: flex; gap: .5rem; }

/* Botón de peligro (eliminar) */
button { padding: .45rem .9rem; border: none; border-radius: 10px; cursor: pointer; font: inherit; }
button.peligro { background: #fee2e2; color: #b91c1c; }
button:hover { opacity: .9; }

/* Badges de estado con colores */
.badge { font-size: .75rem; font-weight: 600; padding: .2rem .6rem; border-radius: 999px; }
.badge.pendiente { background: #fef3c7; color: #b45309; }
.badge.en-proceso { background: #dbeafe; color: #1d4ed8; }
.badge.resuelta { background: #dcfce7; color: #15803d; }

.error { color: #b91c1c; }
</style>
