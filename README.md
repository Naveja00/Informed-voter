# Informed Voter (MVP Scaffold)

Neutral election intelligence platform built around verified public data.

## Run locally

```bash
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Included in this scaffold
- Next.js + TypeScript + Tailwind dashboard pages
- FastAPI backend with v1 routes for politicians, elections, bills
- Dockerized local development setup
- Environment variable template

## Next steps
- Add PostgreSQL models + Alembic migrations
- Connect ETL ingestion jobs and search indexing
- Replace mock data with verified source connectors
- Add authentication, watchlists, and ballot lookup integrations
