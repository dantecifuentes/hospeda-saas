# Hospeda on Mac without Docker

This is a **local development demonstration**, not a public production deployment. It uses the existing local PostgreSQL database and `uploads/` folder; do not use it to accept real payments or customer data. The checkout provider remains disabled.

## First start
1. Install dependencies: `npm ci`.
2. Create a private random 64-character hexadecimal signing secret at `~/.config/hospeda/local-jwt-secret` (mode 0600). Never commit this file. Example: `mkdir -p ~/.config/hospeda && chmod 700 ~/.config/hospeda && openssl rand -hex 32 > ~/.config/hospeda/local-jwt-secret && chmod 600 ~/.config/hospeda/local-jwt-secret`.
3. Configure the existing private `.env` with local PostgreSQL connection details; do not commit it.
4. `npm run local:build` compiles the frontend for port 53130 and runs tracked migrations.
5. `npm run local:start` launches `hospeda-local` under PM2.
6. Open `http://localhost:53130/`; check `http://localhost:53130/api/health`.

`ecosystem.config.cjs` binds the API to loopback (`127.0.0.1`) only, sets the photo directory to the project `uploads/` folder, and keeps Mercado Pago disabled. The signing secret is read from the private user config file, not the repository. PM2 does not automatically start at Mac boot unless separately configured. PM2 logs are under `~/.pm2/logs`.

## Maintenance
- After code changes: `npm run local:build && npm run local:restart`.
- Check status: `npm run local:status`.
- Check logs: `npm run local:logs`.
- Stop only Hospeda: `npm run local:stop`.
- The normal `npm run qa:all` builds with the default Vite configuration. **Run `npm run local:build` again afterward** to restore the local production frontend's port 53130 API setting.

This local process is not a replacement for HTTPS, isolated production database, backup automation, access control at the network edge, monitoring, transactional email or live payment-provider configuration. Do not configure PM2 startup or deploy to Oracle Cloud without reviewing other applications on that host.
