# Food Store — Panel de Administración

Panel interno para administrar la tienda: dashboard con gráficos, CRUD de catálogo
(con imágenes en Cloudinary), gestión de stock, ciclo de vida de pedidos (FSM) y
feed de pedidos en **tiempo real** vía WebSocket. Acceso por **rol** (ADMIN, STOCK, PEDIDOS).

Es el frontend de administración del sistema Food Store (requiere el **backend** corriendo):

| Repo | Rol | Puerto |
| :--- | :--- | :--- |
| integrador2 | Backend FastAPI | `8000` |
| Repo-Store | Storefront del cliente | `5173` |
| **Repo-Admin** (este) | Panel de administración | `5174` |

## Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** (estado del servidor) · **Zustand** (sesión) · **React Hook Form**
- **Recharts** (gráficos del dashboard) · **Axios** (cookies httpOnly, refresh 401) · **Tailwind CSS v4**
- Arquitectura **Feature-Sliced**: `src/modules/<feature>/{types,services,hooks,components,pages}`

## Requisitos

- **Node.js 20+**
- **pnpm** (recomendado) — `npm i -g pnpm`
- El **backend** corriendo en `http://localhost:8000` (ver el repo `integrador2`).

## Cómo levantarlo

```bash
# 1) Dependencias
pnpm install

# 2) Variables de entorno
cp .env.example .env
#   por defecto apunta a http://localhost:8000/api/v1 — ajustar si el backend está en otro host

# 3) Dev server (en el puerto 5174 para no chocar con el Store)
pnpm dev --port 5174
```

- App: <http://localhost:5174>

Otros scripts: `pnpm build` (typecheck + build de producción) · `pnpm preview` · `pnpm lint`.

> Si no pasás `--port`, Vite usa el `5173`; si el Store ya lo ocupa, elige el siguiente libre.
> Si preferís npm: `npm install` + `npm run dev -- --port 5174`.

## Acceso

Usar las credenciales del seed del backend (rol ADMIN):

```
email:    admin@foodstore.com
password: admin123
```

## Variables de entorno

| Variable | Descripción | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API. **Debe incluir** `/api/v1`. | `http://localhost:8000/api/v1` |

## Estructura

```
src/
├── api/                    # axiosInstance (cookies + refresh 401)
├── store/                  # authStore
└── modules/
    ├── auth/               # login + guards por rol
    ├── dashboard/          # KPIs + gráficos Recharts (landing del ADMIN)
    ├── categorias/  ingredientes/  productos/   # CRUD + upload Cloudinary
    ├── pedidos/            # gestión FSM + feed WS (usePedidosSocket)
    ├── cocina/             # vista de preparación
    └── usuarios/           # gestión de usuarios y roles
```

## Notas

- La sesión se maneja con **cookies httpOnly**; Axios usa `withCredentials: true`.
- El feed de pedidos en tiempo real escucha los eventos del WebSocket del backend
  (`/api/v1/pedidos/ws`) y refresca las vistas sin recargar.

## Entrega

- Carpeta del proyecto (Drive): <https://drive.google.com/drive/u/0/folders/1rD6m_CmaMqE0NhEshcEeYeRTF7zvpcle>
- 🎥 Video demo (10–15 min): _pendiente de subir — pegar el link acá_
