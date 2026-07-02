# 🛠️ Guía de cambios — cómo modificar el proyecto tú mismo

Esta guía te dice **dónde** y **qué** cambiar para personalizar el proyecto (colores, textos, botones,
datos, etc.). No necesitas saber mucho: busca el archivo, cambia lo que se indica y vuelve a compilar.

---

## 0) Cómo aplicar CUALQUIER cambio

1. Edita el archivo que indique la guía y **guarda**.
2. Vuelve a compilar y arrancar desde la carpeta raíz:
   ```powershell
   npm run dev
   ```
   (compila los 4 frontends y arranca el servidor en http://localhost:3001)
3. Refresca el navegador.

> **Solo cambiaste un frontend?** Puedes recompilar solo ese (más rápido). Ejemplos:
> `npm --prefix frontend-react run build` · `npm --prefix frontend-vue run build`
> Luego arranca con `npm start`.
>
> **Cambiaste el backend** (`backend/…`)? Basta con reiniciar el servidor: `Ctrl+C` y `npm start`.

**Para reflejarlo en GitHub y StackBlitz:**
```powershell
git add -A
git commit -m "describe tu cambio"
git push
```
Luego reabre `https://stackblitz.com/github/ALI-SKAN/proyecto-integral-js`.

---

## 1) Mapa rápido: qué archivo toca cada cosa

| Parte / Función | Framework | Archivo principal | CSS (estilos) |
|---|---|---|---|
| Registrar `/registrar` | React | `frontend-react/src/App.jsx` | `frontend-react/src/index.css` |
| Editar `/editar` | Angular | `frontend-angular/src/app/consulta-list.component.ts` y `app.component.ts` | `frontend-angular/src/styles.css` |
| Filtrar `/filtrar` | Vue | `frontend-vue/src/App.vue` (HTML **y** estilos en el mismo archivo) | dentro de `App.vue` (`<style>`) |
| Estado `/estado` | Next | `frontend-next/app/page.jsx` y `layout.jsx` | `frontend-next/app/globals.css` |
| API y datos | Node + TS | `backend/src/consultas.ts`, `backend/src/server.ts`, `backend/src/types.ts` | — |

---

## 2) Cambiar el color / tema (degradado morado)

El color principal es un degradado **índigo → violeta**: `#6366f1` y `#8b5cf6`
(en Angular la cabecera añade rosa `#ec4899`). Están repetidos en cada frontend (son 4 frameworks distintos),
así que para cambiar el tema completo edita estos 4 archivos y reemplaza esos códigos de color:

| Archivo | Qué buscar |
|---|---|
| `frontend-react/src/index.css` | `#6366f1` y `#8b5cf6` |
| `frontend-vue/src/App.vue` (bloque `<style>`) | `#6366f1` y `#8b5cf6` |
| `frontend-angular/src/styles.css` | `--primary: #6366f1;`, `#8b5cf6`, `#ec4899` |
| `frontend-next/app/globals.css` | `#6366f1` y `#8b5cf6` |

**Ejemplo** (cambiar a un tema verde-azulado). Antes:
```css
background: linear-gradient(135deg, #6366f1, #8b5cf6);
```
Después:
```css
background: linear-gradient(135deg, #0ea5e9, #14b8a6);
```

> Truco: en tu editor usa "Reemplazar en el archivo" (Ctrl+H) para cambiar `#6366f1` por tu color de una vez.

---

## 3) Cambiar los colores de los estados (badges)

Los estados tienen colores fijos. Son los mismos en los 4 frontends:

| Estado | Fondo | Texto |
|---|---|---|
| pendiente | `#fef3c7` | `#b45309` |
| en proceso | `#dbeafe` | `#1d4ed8` |
| resuelta | `#dcfce7` | `#15803d` |

Dónde cambiarlos (busca esas clases):
- React → `frontend-react/src/index.css` → `.estado-pendiente`, `.estado-en-proceso`, `.estado-resuelta`
- Angular → `frontend-angular/src/styles.css` → `.badge-pendiente`, `.badge-en-proceso`, `.badge-resuelta`
- Vue → `frontend-vue/src/App.vue` → `.badge.pendiente`, `.badge.en-proceso`, `.badge.resuelta`
- Next → `frontend-next/app/globals.css` → `.badge.pendiente`, `.badge.proceso`, `.badge.resuelta`

---

## 4) Cambiar títulos y textos

| Qué texto | Archivo | Qué buscar / cambiar |
|---|---|---|
| Título "Registrar Consulta" | `frontend-react/src/App.jsx` | `<h1>Registrar Consulta</h1>` |
| Título "✏️ Editar Consultas" | `frontend-angular/src/app/consulta-list.component.ts` | `<h1>✏️ Editar Consultas</h1>` |
| Título "Filtrar y listar consultas" | `frontend-vue/src/App.vue` | `<h1>Filtrar y listar consultas</h1>` |
| Título "Consultas" (Estado) | `frontend-next/app/page.jsx` | `<h2>Consultas</h2>` |
| Título de la pestaña del navegador | `frontend-react/index.html`, `frontend-vue/index.html`, `frontend-angular/src/index.html` (etiqueta `<title>`) y `frontend-next/app/layout.jsx` (`title: "..."`) | `<title>...</title>` |

Solo cambia el texto entre las etiquetas y guarda.

---

## 5) Cambiar la barra de navegación (nombres o enlaces)

La barra superior con **Registrar / Editar / Filtrar / Estado** está en cada frontend:

| Framework | Archivo | Qué buscar |
|---|---|---|
| React | `frontend-react/src/App.jsx` | la función `Nav()` (los `<a ...>Registrar</a>`, etc.) |
| Angular | `frontend-angular/src/app/app.component.ts` | el `<nav class="topnav">` |
| Vue | `frontend-vue/src/App.vue` | el `<nav class="nav">` |
| Next | `frontend-next/app/layout.jsx` | el `<nav className="nav">` |

Puedes cambiar el **texto** del enlace (ej. "Registrar" → "Nueva consulta").
⚠️ **No cambies la parte del enlace `href="/registrar"`** salvo que también cambies las rutas del servidor
(ver sección 9-avanzado), o dejará de funcionar la navegación.

---

## 6) Cambiar los botones (texto y estilo)

**Texto del botón** (en el HTML/plantilla):
- React → `frontend-react/src/App.jsx` → `<button type="submit">Registrar</button>`
- Angular → `frontend-angular/src/app/consulta-list.component.ts` → botones `Actualizar`, `Cancelar`, `Ver`, `Editar`
- Vue → `frontend-vue/src/App.vue` → botón `Eliminar`
- Next → `frontend-next/app/page.jsx` → botón `Cerrar`

**Estilo del botón (color, bordes):**
- React → `frontend-react/src/index.css` → regla `button { ... }` (cambia el `background`)
- Angular → `frontend-angular/src/styles.css` → `.btn`, `.btn-primary`, `.btn-danger`
- Vue → `frontend-vue/src/App.vue` (`<style>`) → `button` y `button.peligro`
- Next → `frontend-next/app/globals.css` → `.detalle button`

**Ejemplo** — hacer el botón más redondeado y verde (React, en `index.css`):
```css
button {
  cursor: pointer;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;         /* más redondeado */
  color: #fff;
  background: #16a34a;          /* verde */
}
```

---

## 7) Cambiar los datos de ejemplo iniciales

Las 2 consultas que aparecen al inicio están en el backend:

📄 `backend/src/consultas.ts` → arreglo `consultas` (arriba del archivo).

```ts
let consultas: ConsultaEstudiante[] = [
  { id: 1, estudiante: 'Ana Torres', asunto: 'Matrícula', mensaje: '…', estado: 'pendiente', fecha: new Date().toISOString() },
  { id: 2, estudiante: 'Luis Pérez', asunto: 'Notas',     mensaje: '…', estado: 'en proceso', fecha: new Date().toISOString() },
];
```
Cambia los textos, agrega o quita objetos. Si agregas uno nuevo, dale un `id` distinto y ajusta
`let siguienteId = 3;` (justo debajo) para que sea mayor que el último id.

> Recuerda: los datos viven **en memoria**, se reinician cada vez que reinicias el servidor.

---

## 8) Cambiar el puerto (por si el 3001 está ocupado)

📄 `backend/src/server.ts` → línea:
```ts
const PORT = Number(process.env.PORT) || 3001;
```
Cambia `3001` por otro (ej. `3005`). No necesitas tocar los frontends: usan la API de forma relativa.

---

## 9) (Avanzado) Añadir un campo nuevo al modelo (ej. "carrera")

Tocarías **varios archivos** porque el dato viaja por todo el sistema:
1. `backend/src/types.ts` → añade `carrera: string;` a la interfaz `ConsultaEstudiante`.
2. `backend/src/consultas.ts` → añade `carrera` a los datos de ejemplo.
3. En los frontends donde quieras verlo o capturarlo:
   - Mostrarlo: agrega `{c.carrera}` (React/Next) o `{{ c.carrera }}` (Vue/Angular) donde se pinta la tarjeta.
   - Capturarlo en el formulario de **Registrar** (`frontend-react/src/App.jsx`): añade un `<input name="carrera" ...>`
     y agrégalo a `FORM_VACIO` (arriba del archivo).

---

## 10) (Avanzado) Cambiar los estados posibles (pendiente / en proceso / resuelta)

Si quieres otros estados (ej. "urgente"):
1. `backend/src/types.ts` → edita `export type EstadoConsulta = 'pendiente' | 'en proceso' | 'resuelta';`
2. En cada `<select>` de estado añade la nueva `<option>` (React `App.jsx`, Angular `consulta-list.component.ts`,
   Vue `App.vue`, y el filtro de Vue).
3. Añade su color de badge en los 4 CSS (ver sección 3), con la clase correspondiente.

---

## ⚠️ Errores comunes

- **Cambié algo y no se ve:** falta recompilar. Ejecuta `npm run dev` otra vez (sección 0).
- **La página quedó en blanco / la lista vacía:** el backend no está corriendo, o hubo un error de sintaxis
  (revisa que no borraste una coma, comilla o llave). Mira la terminal y la consola del navegador (F12).
- **Se rompió la navegación entre apps:** cambiaste un `href="/registrar"` (u otra ruta). Déjalos como estaban.
- **En StackBlitz no aparece mi cambio:** primero `git push`, y luego **reabre** el enlace de StackBlitz.
