# Informed Voter — Production Architecture Blueprint

## 1) Full Product Architecture

### System overview
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind + Framer Motion + Recharts/D3.
- **Backend API**: FastAPI (Python) with domain modules (`politicians`, `elections`, `bills`, `finance`, `issues`, `ballot`).
- **Data layer**: PostgreSQL (OLTP), Redis (cache + queues), Typesense (search), S3-compatible object storage (raw snapshots).
- **Data pipelines**: Airflow + Celery workers for ingestion, normalization, enrichment, quality checks.
- **Auth**: Auth.js (email/social + optional passkeys), RBAC (user/admin/data-ops).
- **Infra**: Docker Compose for local; Kubernetes-ready manifests for staging/prod.
- **Observability**: OpenTelemetry + Prometheus + Grafana + Loki + Sentry.

### High-level services
- `web-app` (Next.js SSR + API routes for BFF endpoints)
- `api-gateway` (FastAPI)
- `etl-orchestrator` (Airflow scheduler/web)
- `etl-workers` (Celery)
- `postgres`
- `redis`
- `typesense`
- `object-storage`
- `admin-console` (can be route group inside web app)

---

## 2) Database Schema (PostgreSQL)

### Core entity tables
- `politicians`
  - `id (uuid pk)`, `bioguide_id`, `fec_candidate_id`, `full_name`, `party`, `state`, `district`, `office`, `chamber`, `active`, timestamps
- `politician_terms`
  - `id`, `politician_id`, `office`, `state`, `district`, `start_date`, `end_date`
- `committees`, `politician_committees`
- `elections`
  - `id`, `year`, `office`, `state`, `district`, `election_type`, `election_date`
- `candidacies`
  - `id`, `election_id`, `politician_id`, `party`, `incumbent`, `ballot_status`
- `bills`
  - `id`, `congress`, `bill_type`, `bill_number`, `title`, `official_summary`, `status`, `introduced_at`
- `bill_actions`, `bill_sponsors`, `bill_cosponsors`
- `votes`
  - `id`, `roll_call_id`, `bill_id`, `chamber`, `vote_date`, `question`, `result`
- `vote_positions`
  - `id`, `vote_id`, `politician_id`, `position` (`yes/no/present/not_voting`)
- `donors`, `pacs`, `industries`
- `contributions`
  - `id`, `politician_id`, `donor_id`, `pac_id`, `industry_id`, `amount`, `contribution_date`, `cycle`, `source_system`
- `independent_expenditures`
- `issues`, `bill_issues`, `vote_issues`
- `watchlists`, `watchlist_items`, `saved_comparisons`, `bookmarks`
- `source_records`
  - provenance table with `source_name`, `source_url`, `retrieved_at`, `checksum`, `raw_object_uri`
- `ai_explanations`
  - stores AI summaries with `model`, `generated_at`, `disclaimer`, `linked_entity`

### Data integrity
- Unique keys on external IDs (`bioguide_id`, `fec_candidate_id`, bill compound keys).
- Temporal columns for historical tracking.
- Soft-delete for user-generated records.

---

## 3) API Design (FastAPI)

### Versioning
- `/api/v1/...`

### Key endpoints
- `GET /politicians`, `GET /politicians/{id}`
- `GET /politicians/{id}/votes`, `/funding`, `/bills`, `/timeline`
- `GET /elections`, `GET /elections/{id}`, `GET /elections/{id}/matchup`
- `GET /bills`, `GET /bills/{id}`, `GET /bills/{id}/votes`
- `GET /finance/contributions`, `/pacs`, `/industries`
- `GET /issues`, `GET /issues/{slug}`
- `POST /ballot/lookup` (zip/address lookup)
- `POST /watchlists`, `GET /watchlists/{id}`
- `GET /search?q=` (Typesense federated search)
- `GET /metadata/sources` (source transparency endpoint)

### API design rules
- Cursor pagination.
- Strong response typing (`pydantic`).
- Include `source_links`, `last_updated_at`, `data_confidence` metadata in responses.

---

## 4) Frontend Structure (Next.js)

```txt
apps/web/
  app/
    (marketing)/
    dashboard/
      politicians/
      elections/
      bills/
      issues/
      finance/
      ballot/
      compare/
      watchlists/
    admin/
  components/
    charts/
    tables/
    cards/
    maps/
    filters/
    comparison/
  lib/
    api-client.ts
    auth.ts
    formatters.ts
    source-badges.ts
  styles/
```

### Reusable components
- `PoliticianHeaderCard`
- `VotingTrendChart`
- `DonorIndustryTreemap`
- `PACNetworkGraph`
- `BillTimeline`
- `CandidateComparisonTable`
- `ElectionMap`
- `SourceAttributionPanel`

---

## 5) Backend Structure

```txt
apps/api/
  app/
    main.py
    core/ (config, security, logging)
    db/ (models, migrations, session)
    modules/
      politicians/
      elections/
      bills/
      voting/
      finance/
      issues/
      ballot/
      search/
      users/
      admin/
    schemas/
    services/
    repositories/
    tests/
```

---

## 6) ETL Pipeline Design

### Pipeline stages
1. **Extract**: pull from Congress.gov, GovTrack, ProPublica, FEC, OpenSecrets, Ballotpedia, state feeds.
2. **Land raw**: immutable raw JSON/CSV in object storage with checksums.
3. **Normalize**: canonical schema + unit/date/ID normalization.
4. **Entity resolution**: merge duplicate politicians/PACs/donors using deterministic + fuzzy rules.
5. **Enrich**: issue tagging, bill-topic classification, district mapping.
6. **Load**: upserts into PostgreSQL + index updates in Typesense.
7. **Validate**: row counts, null thresholds, referential checks, anomaly alerts.

### Scheduling
- Daily incremental jobs + weekly backfills.
- Event-driven refresh for major roll-call/election updates.

---

## 7) Data Normalization Strategy

- Canonical entity IDs across providers.
- Name normalization (casefold, punctuation stripping, nickname aliases).
- Deterministic identity precedence (Bioguide > FEC > provider-local IDs).
- Currency normalization to USD cents.
- Timezone normalization to UTC; display localized in UI.
- Versioned records + slowly changing dimensions for historical correctness.

---

## 8) UI/UX System

### Design language
- Dark-first analytical interface; optional light mode.
- Typography: Inter + JetBrains Mono for numeric/ledger views.
- Card and panel system with strong visual hierarchy.
- “Evidence-first” UI: every metric links back to primary source.

### Core dashboard patterns
- Sticky global filters (year/state/chamber/issue).
- Split panes for profile + trend context.
- Compare mode with synchronized charts.
- Confidence badges: `Official`, `Aggregated`, `AI Summary`.

---

## 9) MVP Roadmap (0–16 weeks)

- **Phase 1 (Weeks 1–4)**: Foundation, auth, schema, ingestion skeleton, basic politician and bill pages.
- **Phase 2 (Weeks 5–8)**: Voting records, election matchups, search, watchlists.
- **Phase 3 (Weeks 9–12)**: Funding/PAC analytics, issue pages, ballot lookup.
- **Phase 4 (Weeks 13–16)**: QA hardening, observability, security review, beta launch.

---

## 10) Scaling Roadmap

- Read replicas for Postgres.
- Partition large fact tables (`vote_positions`, `contributions`) by cycle/year.
- Caching by query signature in Redis.
- Async materialized views for heavy aggregates.
- CDN edge caching for static/SSR routes.
- Queue autoscaling by lag depth.

---

## 11) Deployment Instructions

### Local
- `docker compose up --build`
- Run migrations, seed sample data.

### Production
- Frontend: Vercel.
- API/Workers: Render/Railway/AWS ECS.
- DB: managed PostgreSQL.
- Redis: managed instance.
- Search: Typesense Cloud or self-hosted cluster.

### Kubernetes-ready
- Separate deployments for `web`, `api`, `worker`, `scheduler`.
- HPA on API and worker deployments.
- Secrets via external secrets manager.

---

## 12) Security Recommendations

- Row-level authorization on user-owned objects.
- Signed source ingestion manifests.
- Rate limiting + bot protection.
- Audit logs for admin actions.
- Encryption at rest + TLS in transit.
- SBOM + dependency scanning in CI.
- PII minimization for ballot lookup; redact and expire address queries.

---

## 13) Monetization Ideas (Neutral + Non-partisan)

- Pro analytics subscription (deeper historical exports).
- Team workspaces for policy researchers/newsrooms.
- API access tiers.
- Premium alerts and custom dashboards.
- White-label civic data widgets.

---

## 14) Example Dashboards

- **National Pulse**: top upcoming elections, recent major votes, funding flows by industry.
- **Legislative Activity**: bill velocity, sponsorship trends, cross-party cosponsorship.
- **Finance Intelligence**: PAC concentration, donor trend changes, independent expenditure spikes.

---

## 15) Example Candidate Matchup Page

Sections:
1. Candidate summary cards
2. Side-by-side metrics table
3. Funding comparison chart (industry + PAC)
4. Voting alignment overlap chart
5. Sponsored bills by issue
6. Source links + update timestamps

---

## 16) Example Political Profile Page

Sections:
1. Identity + office card
2. Participation/missed vote KPI row
3. Voting timeline and issue alignment
4. Bills sponsored/cosponsored tables
5. Funding treemap + donor concentration
6. Election history and committee service
7. Source provenance drawer

---

## 17) Example Election Map Views

- Choropleth by competitiveness and fundraising totals.
- District-level hover cards.
- Filters: year, office, party, issue salience.
- Toggle map/table split view for accessibility.

---

## Recommended Folder Structure (Monorepo)

```txt
informed-voter/
  apps/
    web/
    api/
    etl/
  packages/
    ui/
    config/
    types/
    eslint-config/
  infra/
    docker/
    k8s/
    terraform/
  docs/
    architecture/
    data-dictionary/
    runbooks/
  .github/workflows/
```

## Env Variables (example)

```env
# app
NEXT_PUBLIC_APP_URL=
API_BASE_URL=
AUTH_SECRET=

# db/cache/search
DATABASE_URL=
REDIS_URL=
TYPESENSE_URL=
TYPESENSE_API_KEY=

# data sources
CONGRESS_GOV_API_KEY=
PROPUBLICA_API_KEY=
FEC_API_KEY=
OPENSECRETS_API_KEY=

# storage/observability
S3_ENDPOINT=
S3_BUCKET_RAW=
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

## Testing + CI/CD

- Backend: `pytest`, contract tests, migration tests.
- Frontend: `vitest`, `playwright`, accessibility checks.
- Data: schema tests + freshness checks.
- CI: lint, typecheck, tests, security scans, docker build.
- CD: staged rollout (dev -> staging -> prod), blue/green for API.

