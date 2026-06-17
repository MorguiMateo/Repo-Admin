# Food Store — Panel Admin

#INTEGRANTES:

MORGUI MATEO - DIAZ MANUEL

## Requisitos

- **Node.js 20+**
- **pnpm** (recomendado) — `npm i -g pnpm`
- El **backend** corriendo en `http://localhost:8000` (en el repo `integrador2`).

## Paso 1:

```bash
pnpm install

cp .env.example .env

pnpm dev --port 5174
```

- puerto: <http://localhost:5174>

## Acceso

Credenciales cuenta Admin:

```
email:    admin@foodstore.com
password: admin123
```

## Variables de entorno

| Variable | Descripción | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API. **Debe incluir** `/api/v1`. | `http://localhost:8000/api/v1` |

## Entrega

- Drive: <https://docs.google.com/spreadsheets/d/1plNcvdJT7733y3KcPK-2RKfbEN0qjQ9UljizbHL_bxo/edit?gid=183617050#gid=183617050>
- Video: https://www.youtube.com/watch?v=rqi4oC-SgBA
