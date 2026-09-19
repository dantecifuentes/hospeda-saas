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
Back up before migrating. Run `npm run db:migrate` on an empty database, or follow the existing-database baseline procedure below. A migration ledger now records applied versions and checksums; automated rollbacks are not implemented. Run `npm run qa:all` against a disposable staging database, not live guest records: QA registers tenants and writes test bookings. Configure logs, backups, TLS and monitoring before accepting real reservations.

## Remaining release blockers
Persistent object storage and photo URLs, production CORS and hosting verification, external guest delivery (email/SMS/WhatsApp), a background expiry worker, production-grade secret management and rate-limit store, provider sandbox checkout/webhook testing and settlement reconciliation. The guest status link is a bearer capability; it must be kept private.

## Repeatable migrations and existing local databases
`npm run db:migrate` creates `schema_migrations`, applies pending SQL files transactionally in filename order and records SHA-256 checksums. An advisory lock serializes concurrent migration processes. It refuses modified previously applied files. For a database already manually migrated through all five files, `npm run db:migrate -- --baseline-existing` checks that key database objects exist and records the five existing migrations; run it **once only** after confirming the existing schema. It is not a complete schema-diff tool and does not replace backups. Fresh databases must use plain `npm run db:migrate`.

## Persistent photo volume
Set `STORAGE_DIR` to an absolute path on a mounted persistent volume (e.g. `/mnt/hospeda-uploads`). The API serves `/uploads/*` from that directory and stores public URLs based on `PUBLIC_API_URL` rather than localhost. Back up the volume along with PostgreSQL. An ephemeral container directory will still lose photos on redeploy; no S3/R2 integration or automated volume provisioning is implemented yet. Avoid changing `PUBLIC_API_URL` without migrating already-stored photo URLs.

## Containerized staging (not publicly deployed)
`Dockerfile` builds the Vite frontend with `VITE_API_BASE_URL` and packages it alongside the Express API; the production API serves `dist/` with a SPA fallback for deep links while keeping unknown `/api/*` routes as JSON 404. The container runs `db:migrate` before starting the API. `.dockerignore` excludes local secrets, database files, uploads and development dependencies.

`compose.staging.yml` defines a PostgreSQL 17 container with a named database volume, a named photo volume and the application bound **only to 127.0.0.1:53129**. It requires a private env file based on `.env.staging.example` (replace every placeholder with independent random credentials and real HTTPS origins). To validate: `docker compose --env-file /path/to/private.env -f compose.staging.yml config --quiet`. To start when Docker Desktop is running: `docker compose --env-file /path/to/private.env -f compose.staging.yml up --build -d`. Put an HTTPS reverse proxy in front before public access. The sample is not a ready-made public deployment and does not configure TLS, DNS, off-site backups or monitoring.

The `qa:staging-smoke` test starts a production-mode Node process against the **local development PostgreSQL** and verifies health, frontend deep links and API 404 behavior. It does not test Docker itself or a separate staging database. Docker Compose syntax was checked, but Docker daemon availability is required for an image build and actual container test.

## Restart persistence smoke test
`npm run qa:photo-persistence` creates a unique QA tenant and cabin in the local development PostgreSQL, uploads a 1-pixel PNG to a temporary configured photo directory, restarts the production-mode API, then verifies the persisted photo record and exact photo bytes. The test removes its temporary photo directory; the QA tenant and cabin remain in the local database. This verifies process-restart persistence, **not** a Docker container restart or an off-site backup. The test must not run against a production database.

## Photo upload hardening
Uploaded photo filenames now use a server-chosen extension based on the accepted MIME type, not the user-supplied filename. The first bytes are checked against JPEG/PNG/WebP signatures before database insertion; rejected uploads are deleted. This blocks trivial HTML-file uploads disguised as images, but is not full image decoding, malware scanning or image re-encoding. Existing files uploaded before this change should be audited before public release.

## Local Docker preflight (September 19, 2026)
Run `npm run check:local-docker` before trying Compose. It verifies the Docker CLI, Compose plugin, engine connectivity and available disk space without deleting data. The Mac currently has the CLI and Compose, but the engine did not respond after attempts to open Docker Desktop; approximately 4.6 GiB of disk space was available. Docker Desktop has an existing `Docker.raw` virtual disk image; **do not delete it** to free space because it may contain existing containers, volumes and databases. Free space by reviewing personal files or Docker Desktop's own supported cleanup interface after confirming what is safe to remove. Docker image build and container persistence testing remain unverified.
