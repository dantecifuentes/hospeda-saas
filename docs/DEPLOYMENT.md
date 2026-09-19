# Hospeda: deployment preparation (not a production release)

## Architecture
Deploy the Vite frontend as a static HTTPS site and the Express API as a separate HTTPS service, backed by a managed PostgreSQL database. Uploaded photos need persistent storage; the current local `uploads/` directory is not suitable for ephemeral hosting. Do not point a live tenant at the local demo database. Use a dedicated database, backup policy, TLS, and controlled migration process.

## Build and runtime
- Frontend build: `npm ci && npm run build`; publish `dist/` and configure SPA fallback to `index.html` for `/reservar/:slug` and `/reserva/seguimiento`.
- API: `npm ci && npm run api`; set `NODE_ENV=production`, `API_PORT` to the host-assigned port, `DATABASE_URL` to managed PostgreSQL and a random `JWT_SECRET` (32+ characters). Configure the service health check at `/api/health`.
- Frontend build environment: `VITE_API_BASE_URL=https://api.your-domain.example/api`. Vite embeds this value at build time: changing it requires rebuilding the frontend. No secret belongs in any `VITE_` variable.
- API environment: `CLIENT_ORIGINS=https://your-domain.example`, `PUBLIC_API_URL=https://api.your-domain.example/api`, `PUBLIC_WEB_URL=https://your-domain.example`.
- Keep `MP_PAYMENTS_ENABLED=false` and do not configure real checkout until provider sandbox tests and payment/refund reconciliation are complete. Do not treat manual refund bookkeeping as a payment-provider refund.
- Run `npm run check:deploy` with production environment variables before deployment. This checks configuration consistency; it does not deploy, provision infrastructure, verify secrets against providers or certify security.

## Database and operations
Apply `db/migrations/001_initial.sql` through `005_notifications.sql` in order to an empty database, or only unapplied migrations on an existing database. Back up before migrating. Current project has no migration ledger or rollback automation; track applied versions operationally. Run `npm run qa:all` against a disposable staging database, not live guest records: QA registers tenants and writes test bookings. Configure logs, backups, TLS and monitoring before accepting real reservations.

## Remaining release blockers
Persistent object storage and photo URLs, production CORS and hosting verification, external guest delivery (email/SMS/WhatsApp), a background expiry worker, production-grade secret management and rate-limit store, provider sandbox checkout/webhook testing and settlement reconciliation. The guest status link is a bearer capability; it must be kept private.
