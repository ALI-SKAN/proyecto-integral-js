"use client";

import { useEffect, useState } from "react";

// API mismo origen/puerto (servidor unificado)
const API = "/api/consultas";

// Clase de badge segun el estado
function badgeClass(estado) {
  const e = (estado || "").toLowerCase();
  if (e === "resuelta") return "badge resuelta";
  if (e === "en proceso") return "badge proceso";
  return "badge pendiente"; // pendiente por defecto
}

// Vista publica de estados (Client Component: fetch en el cliente)
export default function HomePage() {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState(null);
  const [sel, setSel] = useState(null); // consulta seleccionada (detalle)

  // Trae los datos en vivo al montar
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("error");
        return res.json();
      })
      .then(setConsultas)
      .catch(() => setError("No se pudo conectar con la API."));
  }, []);

  if (error) return <p className="card">{error}</p>;

  return (
    <section>
      <h2>Consultas</h2>

      {consultas.length === 0 ? (
        <p className="card">No hay consultas registradas.</p>
      ) : (
        <ul className="lista">
          {consultas.map((c) => (
            <li key={c.id} className="card item" onClick={() => setSel(c)}>
              <span>{c.asunto}</span>
              <span className={badgeClass(c.estado)}>{c.estado}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Detalle en la misma pagina con estado de cliente */}
      {sel && (
        <div className="card detalle">
          <h3>{sel.asunto}</h3>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={badgeClass(sel.estado)}>{sel.estado}</span>
          </p>
          <p><strong>Estudiante:</strong> {sel.estudiante}</p>
          <p><strong>Mensaje:</strong> {sel.mensaje}</p>
          <p><strong>Fecha:</strong> {new Date(sel.fecha).toLocaleString()}</p>
          <button onClick={() => setSel(null)}>Cerrar</button>
        </div>
      )}
    </section>
  );
}
