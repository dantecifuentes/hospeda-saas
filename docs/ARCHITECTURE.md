# Hospeda — arquitectura base (Fase 1)

## Decisión técnica vigente
El código ejecutable usa **React + Vite (frontend)**, **Node.js + Express (API)** y **PostgreSQL 17 (datos)**. No usamos Next.js, Prisma ni TypeScript todavía; no confundir propuestas antiguas con dependencias instaladas. El backend corre en `53128`, el frontend local en `53127`. El esquema inicial versionado es `db/migrations/001_initial.sql`.

## Límites y responsabilidades
- `src/`: panel y marketplace. `src/main.jsx` y `src/Marketplace.jsx` siguen concentrando código legado de demo; modularización completa queda pendiente.
- `src/Account.jsx`: registro, login y alojamiento real conectado a API.
- `src/Onboarding.jsx`: asistente **demo** con `localStorage`, no usar para clientes reales.
- `server/index.js`: API real inicial. Toda operación privada toma la organización del token validado, nunca de un ID enviado por el cliente.
- `db/`: modelo relacional y migración inicial. No editar migraciones ya aplicadas; agregar `002_*.sql`, etc.
- `uploads/`: fotos locales de desarrollo; para producción migrar a R2/S3 con URL persistente y controles de acceso.
- `tests/qa.mjs`: pruebas browser del marketplace demo. Aún faltan pruebas automatizadas de API, aislamiento de empresas, concurrencia y pagos.

## Modelo y reglas invariantes
Organización → usuarios, alojamientos, fotografías, huéspedes, reservas, pagos y tareas. `organization_id` se exige en consultas privadas. Check-in inclusivo, check-out exclusivo; impedir solapamientos transaccionalmente antes de activar checkout real. Reservas y pagos son entidades separadas. Pago de anticipo o total se calcula en el servidor; un cálculo no equivale a un cobro. Comisión de marketplace se registra separada del monto del huésped. Webhooks de pago deberán verificarse y procesarse de manera idempotente.

## Flujos
Registro propietario → empresa → JWT → creación de alojamiento → subida de fotos → página pública (API). La reserva pública actualmente solo ofrece **cotización y verificación de disponibilidad** en API; NO realiza pagos ni garantiza bloqueo de fechas. El marketplace demo sigue operando en navegador con alojamientos simulados.

## Riesgos y deuda conocida
- Autenticación inicial JWT en localStorage: antes de producción migrar a sesión/cookie HttpOnly o endurecer estrategia equivalente, rotación y revocación.
- El registro de usuarios y empresas carece de límites de tasa y verificación de correo.
- Carga de fotos requiere validación de contenido real, limpieza de archivos fallidos y almacenamiento cloud.
- API de reserva necesita transacciones, restricciones de concurrencia, expiración y confirmación por webhook.
- API pública debe limitar consultas, validar fechas/precios y añadir observabilidad.
- El backend inicial tiene un solo archivo: dividir por dominio al ampliar módulos.
- La UI antigua y Marketplace demo usan `localStorage`; no representan persistencia SaaS.

## Git
`main`: integración estable; `develop`: integración de cambios nuevos; `feature/*`: una función o corrección aislada; PR a develop y luego a main tras QA. Nunca subir `.env`, secretos, `uploads/`, `node_modules/` o `dist/`. Cada entrega debe ejecutar `npm run build` y `npm run qa` y verificar la API si fue modificada.

## Fases siguientes
Fase 2: consolidar la experiencia de administración y UX. Fase 3: migrar TODOS los módulos de demo a API y completar seguridad multiempresa. Fase 4: autogestión real. Fase 5: motor transaccional y pagos. Fase 6: MVP desplegado y endurecido. Fase 7: Marketplace real. Fase 8: integraciones avanzadas.
