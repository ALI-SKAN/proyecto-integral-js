import { useState, useEffect } from 'react'

// API relativa: mismo origen y puerto (servidor unificado en 3001)
const API = '/api/consultas'

// Estado inicial del formulario
const FORM_VACIO = { estudiante: '', asunto: '', mensaje: '', estado: 'pendiente' }

// Barra de navegacion comun a las 4 funciones (Registrar activo)
function Nav() {
  return (
    <nav className="nav">
      <a className="nav-link activo" href="/registrar">Registrar</a>
      <a className="nav-link" href="/editar">Editar</a>
      <a className="nav-link" href="/filtrar">Filtrar</a>
      <a className="nav-link" href="/estado">Estado</a>
    </nav>
  )
}

function App() {
  // useState: formulario, lista de consultas y mensaje de exito
  const [form, setForm] = useState(FORM_VACIO)
  const [consultas, setConsultas] = useState([])
  const [mensaje, setMensaje] = useState('')

  // Carga las consultas registradas desde la API
  const cargarConsultas = async () => {
    const res = await fetch(API)
    const datos = await res.json()
    setConsultas(datos)
  }

  // useEffect: cargar la lista al montar el componente
  useEffect(() => {
    cargarConsultas()
  }, [])

  // Actualiza el estado del formulario al escribir
  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Registrar una nueva consulta (POST) y refrescar la lista
  const registrar = async (e) => {
    e.preventDefault()
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm(FORM_VACIO) // limpiar formulario
    setMensaje('Consulta registrada correctamente.') // mensaje de exito
    cargarConsultas() // refrescar lista tras registrar
  }

  return (
    <div>
      <Nav />

      <div className="contenedor">
        <h1>Registrar Consulta</h1>

        {/* Formulario para registrar una nueva consulta */}
        <form className="tarjeta" onSubmit={registrar}>
          <input
            name="estudiante"
            placeholder="Estudiante"
            value={form.estudiante}
            onChange={cambiar}
            required
          />
          <input
            name="asunto"
            placeholder="Asunto"
            value={form.asunto}
            onChange={cambiar}
            required
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            value={form.mensaje}
            onChange={cambiar}
            required
          />
          <select name="estado" value={form.estado} onChange={cambiar}>
            <option value="pendiente">pendiente</option>
            <option value="en proceso">en proceso</option>
            <option value="resuelta">resuelta</option>
          </select>
          <button type="submit">Registrar</button>
        </form>

        {/* Mensaje de exito tras registrar */}
        {mensaje && <p className="exito">{mensaje}</p>}

        {/* Ultimas consultas registradas (solo lectura, feedback de lo creado) */}
        <h2>Ultimas consultas</h2>
        {consultas.length === 0 && <p>No hay consultas registradas.</p>}
        {consultas.map((c) => (
          <div key={c.id} className="tarjeta">
            <strong>{c.estudiante}</strong> - {c.asunto}{' '}
            <span className={`estado estado-${c.estado.replace(' ', '-')}`}>
              {c.estado}
            </span>
            <p>{c.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
