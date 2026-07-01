// Servidor unificado (módulo http nativo, sin dependencias).
// UN SOLO puerto sirve: la API REST + los 4 frontends compilados,
// cada uno bajo una ruta = una función del sistema.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as consultas from './consultas';
import type { ConsultaInput } from './types';

const PORT = Number(process.env.PORT) || 3001;

// Carpeta raíz del proyecto (server.ts está en backend/src → subimos 2 niveles).
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Cada framework compilado se monta bajo una ruta-función.
const MOUNTS = [
  { prefix: '/registrar', dir: join(ROOT, 'frontend-react', 'dist') },                          // React
  { prefix: '/editar',    dir: join(ROOT, 'frontend-angular', 'dist', 'frontend-angular', 'browser') }, // Angular
  { prefix: '/filtrar',   dir: join(ROOT, 'frontend-vue', 'dist') },                            // Vue
  { prefix: '/estado',    dir: join(ROOT, 'frontend-next', 'out') },                            // Next.js (export)
];

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.map': 'application/json', '.txt': 'text/plain',
};

// Lee y parsea el cuerpo JSON de una petición.
const leerBody = (req: IncomingMessage): Promise<any> =>
  new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data ? JSON.parse(data) : {}));
  });

// Responde en JSON (con encabezados CORS).
const enviar = (res: ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body === null ? '' : JSON.stringify(body));
};

// Sirve un archivo estático de un frontend compilado (con fallback a index.html).
const servirEstatico = (res: ServerResponse, dir: string, rel: string): void => {
  const relPath = rel === '' || rel === '/' ? '/index.html' : rel;
  const filePath = normalize(join(dir, decodeURIComponent(relPath)));
  if (!filePath.startsWith(dir)) return enviar(res, 403, { error: 'Prohibido' });
  readFile(filePath, (err, data) => {
    if (err) {
      // Fallback: index.html (o aviso si el frontend no está compilado)
      readFile(join(dir, 'index.html'), (e2, html) => {
        if (e2) return enviar(res, 404, { error: 'Frontend no compilado. Ejecuta: npm run build' });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
};

const server = createServer(async (req, res) => {
  const { method = 'GET', url = '' } = req;
  const ruta = url.split('?')[0];

  if (method === 'OPTIONS') return enviar(res, 204, null); // preflight CORS

  // ---- API REST (/api/consultas) ----
  if (ruta.startsWith('/api/consultas')) {
    const match = ruta.match(/^\/api\/consultas(?:\/(\d+))?$/);
    if (!match) return enviar(res, 404, { error: 'Ruta no encontrada' });
    const id = match[1] ? Number(match[1]) : null;
    try {
      if (id === null) {
        if (method === 'GET') return enviar(res, 200, consultas.listar());
        if (method === 'POST') return enviar(res, 201, consultas.crear((await leerBody(req)) as ConsultaInput));
      } else {
        if (method === 'GET') {
          const c = consultas.obtener(id);
          return c ? enviar(res, 200, c) : enviar(res, 404, { error: 'Consulta no encontrada' });
        }
        if (method === 'PUT') {
          const c = consultas.actualizar(id, await leerBody(req));
          return c ? enviar(res, 200, c) : enviar(res, 404, { error: 'Consulta no encontrada' });
        }
        if (method === 'DELETE') {
          return consultas.eliminar(id)
            ? enviar(res, 200, { mensaje: 'Consulta eliminada' })
            : enviar(res, 404, { error: 'Consulta no encontrada' });
        }
      }
      return enviar(res, 405, { error: 'Método no permitido' });
    } catch {
      return enviar(res, 400, { error: 'Petición inválida' });
    }
  }

  // ---- Inicio: redirige a la primera función ----
  if (ruta === '/') {
    res.writeHead(302, { Location: '/registrar' });
    return res.end();
  }

  // ---- Frontends compilados (cada ruta = una función) ----
  const mount = MOUNTS.find((m) => ruta === m.prefix || ruta.startsWith(m.prefix + '/'));
  if (mount) return servirEstatico(res, mount.dir, ruta.slice(mount.prefix.length));

  return enviar(res, 404, { error: 'Ruta no encontrada' });
});

server.listen(PORT, () => {
  console.log(`✅ Sistema unificado en un solo puerto: http://localhost:${PORT}`);
  console.log(`   /registrar (React) · /editar (Angular) · /filtrar (Vue) · /estado (Next)`);
  console.log(`   API REST: http://localhost:${PORT}/api/consultas`);
});
