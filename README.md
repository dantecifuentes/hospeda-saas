# Hospeda SaaS

Plataforma de gestión de alojamientos con panel, páginas públicas y marketplace. **Proyecto en desarrollo: no está listo para gestionar reservas ni cobros reales.**

## Requisitos
Node.js 20+, npm y PostgreSQL con permisos para crear una base de datos. Chrome instalado para `npm run qa` en Mac.

## Inicio local
```bash
npm install
createdb hospeda
psql hospeda -v ON_ERROR_STOP=1 -f db/migrations/001_initial.sql
cp .env.example .env
# Configura DATABASE_URL y un JWT_SECRET aleatorio y largo en .env
npm run dev:all
```

Frontend: http://localhost:53127/ · API: http://localhost:53128/api/health · Marketplace demo: http://localhost:53127/marketplace. `npm run dev:all` levanta ambos procesos; PostgreSQL debe estar ejecutándose por separado.

Para generar un secreto local: `openssl rand -hex 32`. Nunca lo compartas ni lo subas al repositorio.

## Comandos
- `npm run build`: compila frontend.
- `npm run qa`: QA de marketplace demo; requiere frontend en `53127`.
- `npm run api`: API en `53128`.
- `npm run dev`: frontend Vite; para la configuración completa usa `npm run dev:all`.
- `npm run db:init`: inicializa esquema usando `DATABASE_URL` del entorno; ejecutar **solo en una DB vacía**. No es una herramienta de migraciones incrementales.

## Estado y limitaciones
La sección **Cuenta real** utiliza API/PostgreSQL para propietarios y alojamientos. **Mi empresa**, dashboard, reservas, calendario, finanzas y marketplace antiguo aún utilizan datos demo/localStorage. La API pública permite consultar empresas y cotizar 50%/100%; NO procesa pagos ni crea reservas confirmadas. Las fotos de la API se guardan en `uploads/` localmente. No usar con datos sensibles ni cobros reales.

Arquitectura y deuda: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Modelo inicial: [db/migrations/001_initial.sql](db/migrations/001_initial.sql).
