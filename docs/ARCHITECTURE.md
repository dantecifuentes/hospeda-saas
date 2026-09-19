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

## Phase 3 — authenticated management panel (in progress)
The authenticated panel uses PostgreSQL for organizations, cabins, reservations, payments, tasks and availability blocks. Anonymous/demo routes still use demo browser state; they are **not** a production marketplace or payment integration. Apply `db/migrations/002_availability_blocks.sql` once to existing databases before deploying the phase-3 API. A fresh `db/schema.sql` includes the blocks table. Manual payment entries record administrative claims, not independently verified processor transactions. Cancelled reservations with collected payments require a separate refund workflow; cancellation does not automatically refund.

Cancellation/refund reconciliation: `POST /api/reservations/:id/refunds` is a **manual bookkeeping entry only**, requires a cancelled reservation, positive amount within the net collected balance, and a human-supplied external receipt/reference. It never triggers a bank transfer or payment-processor refund. The reservations API returns net paid (approved collections minus approved recorded refunds). The real panel displays cancelled bookings with an outstanding collected balance for follow-up. Payment processor integration, independent refund verification, audit trails and production readiness remain outstanding.

## Phase 4 public booking request (initial slice)
`/reservar/:slug` loads published active cabins from PostgreSQL, obtains a server-calculated quote, and submits a **pending, unpaid** reservation request. The API recalculates the total, verifies capacity, checks reservations and availability blocks, and locks the cabin row during creation to serialize requests for the same cabin. Pending requests currently hold the dates until manually cancelled; automated expiry, email notification, actual payment checkout and verified webhook confirmation are not yet implemented. The public-facing form explicitly says no payment is taken. Never mark these reservations as paid or confirmed merely because the request endpoint returned HTTP 201.

## Mercado Pago checkout (gated, not activated)
Checkout Pro integration is disabled by default (`MP_PAYMENTS_ENABLED=false`). Requires server-only `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, HTTPS `PUBLIC_API_URL` and `PUBLIC_WEB_URL`; never place secrets in Vite. Apply migrations 003 and 004. A 32-byte bearer capability returned to the booking requester is hashed in the database and required to create a preference. Only a verified HMAC webhook followed by an authenticated GET to Mercado Pago's payment API may record an approved online payment; `provider_payment_id` is unique and the reservation is row-locked. Browser redirects do not confirm payments. This implementation supports **one merchant account for the entire deployment**, not automatic payout/split to each SaaS tenant. It must not be enabled for multi-owner production commerce without merchant onboarding/settlement design and end-to-end sandbox tests. Refunds remain manual records, not processor refunds.

## Phase 4: public request lifecycle and owner website settings
Unpaid `direct_web` requests with `pending` status expire after 48 hours; the expiration query runs during public quote/request and authenticated reservation listing. Any approved collection prevents automatic expiry and requires manual review. `expired` requests no longer block dates; the checkout preference route rejects them. This is a request-level hold, not a payment provider hold or a guaranteed booking. A production scheduler and customer notification are still required. Owners can edit public name, description, location, phone, 50%/100% deposit policy and publication visibility through authenticated `/api/organization`. Disabling publication rejects new public requests and hides the public listing; it does not cancel existing bookings.

## In-app booking notices and guest status
Migration 005 creates tenant-scoped, persistent notifications on successful public booking requests. Owners can list and acknowledge their own notices in the authenticated dashboard; there is **no external email, WhatsApp, SMS or push delivery**. The public `/api/public/reservations/status` endpoint requires both reservation UUID and the original 32-byte checkout capability; it returns only status, dates and total, never guest contact details. This capability is shown to the guest on the successful request page; losing that page loses the status lookup unless a separate delivery/recovery mechanism is later implemented. Booking notices and guest status do not assert that a payment occurred.

## Shareable guest status links (no external delivery)
The confirmation page offers a private shareable `/reserva/seguimiento#<reservation UUID>.<capability>` link. The capability is in the URL fragment, so it is not sent to the web server in the HTTP request; the tracking page POSTs it to the existing status endpoint. Treat the link as a bearer secret: anyone with it can view booking status, dates and total. No account recovery, link revocation, email, SMS or WhatsApp delivery is implemented. Owners may copy a status-specific message from the real reservations panel and send it manually; this is not an automated notification.

## Phase 4 public UX and browser acceptance
The tenant booking page now shows an organization introduction, phone contact link, three-step guide, lodging cards with image fallback, a per-lodging photo gallery, capacity/nightly-rate summary, and responsive layout. The browser acceptance suite `npm run qa:public-ui` runs a mobile-width Chrome session against a real tenant, switches cabins, obtains a PostgreSQL quote, creates a pending request, follows its private tracking link and verifies the owner can see the booking and notification. Photos must be uploaded by the owner; the fallback is not a fabricated lodging photograph. No online payment or external notification is implied.
