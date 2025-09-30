## Local Setup

1. Kopiere `.env.example` zu `.env` und setze Werte (mind. `DATABASE_URL`).
2. Starte Postgres via Docker Compose.
3. Installiere Abhängigkeiten und führe Migrationen aus.

## Commands

```bash
docker compose up -d db
pnpm i
pnpm drizzle:generate
pnpm drizzle:migrate
pnpm db:seed
pnpm dev
```

Healthcheck: `GET /api/health` zeigt Status inklusive DB.

### Produktion / Security / Monitoring
- Logging: `pino` + `pino-http` (Level via `LOG_LEVEL`)
- Security: `helmet` aktiviert in Prod
- Rate Limiting: global unter `/api` (konfigurierbar via `RATE_LIMIT_MAX`)
- Metrics: Prometheus unter `/metrics`

### Environment Variablen
- `CORS_ALLOWED_ORIGINS` (comma-separated; nur in Prod relevant)
- `LOG_LEVEL` (z. B. `info`, `debug`)
- `RATE_LIMIT_MAX` (Requests pro 60s, Default 200)

## Troubleshooting
- Port-Konflikt: Stelle sicher, dass DB auf Port 5435 läuft oder passe `DATABASE_URL` an.
- OpenAI/Stripe optional: Lass Keys leer, wenn Features nicht genutzt werden.


