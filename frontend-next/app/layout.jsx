import "./globals.css";

// Metadata base del sitio
export const metadata = {
  title: "Estado de Consultas",
  description: "Consulta publica del estado de solicitudes.",
};

// Layout raiz con barra de navegacion comun (enlaces entre apps)
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Enlaces absolutos: salen de esta app Next hacia las otras */}
        <nav className="nav">
          <a href="/registrar">Registrar</a>
          <a href="/editar">Editar</a>
          <a href="/filtrar">Filtrar</a>
          <a href="/estado" className="active">Estado</a>
        </nav>
        <main className="contenedor">{children}</main>
      </body>
    </html>
  );
}
