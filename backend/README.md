# EgvoX Identity & Organizations API

One FastAPI runtime owns bounded Identity and Organizations domains. Run from this directory:

```bash
python -m venv .venv
. .venv/bin/activate
pip install -e '.[dev]'
cp .env.example .env
uvicorn app.main:app --reload
ruff check shared app domains tests --select F
pytest -q
python scripts/validate_migration.py
```

Required server secrets: `SUPABASE_URL` and `DATABASE_URL`. The database credential must be backend-only and able to `SET LOCAL ROLE authenticated`; each transaction sets verified JWT claims so PostgreSQL RLS evaluates the actor. Do not use a browser key as a database credential. `SUPABASE_SERVICE_ROLE_KEY` is optional and used only by backend private Storage upload/download operations.

JWT verification accepts Supabase asymmetric JWKS signing algorithms. Legacy HS256 is accepted only if `SUPABASE_JWT_SECRET` is explicitly configured. Issuer, audience, expiry, issued-at, subject UUID and authenticated role are mandatory.

Never point local tests at hosted production. The migration is a reviewed artifact and has not been applied to the hosted Supabase project.
