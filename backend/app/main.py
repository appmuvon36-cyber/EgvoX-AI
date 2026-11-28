from contextlib import asynccontextmanager
import logging
from uuid import uuid4
import asyncpg
from fastapi import FastAPI, Request, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from shared.config import settings
from domains.identity.api.router import router as identity_router
from domains.organizations.api.router import router as organizations_router

logger = logging.getLogger("egvox.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL is required")
    if not settings.supabase_url:
        raise RuntimeError("SUPABASE_URL is required")
    app.state.pool = await asyncpg.create_pool(
        settings.database_url, min_size=1, max_size=10, command_timeout=30,
        server_settings={"application_name": "egvox-identity-api"})
    yield
    await app.state.pool.close()

app = FastAPI(title="EgvoX Identity & Organizations API", version="1.0.0",
    openapi_url="/api/v1/openapi.json", docs_url="/api/v1/docs", redoc_url=None, lifespan=lifespan)

@app.middleware("http")
async def request_context(request: Request, call_next):
    candidate = request.headers.get("x-request-id", "")\n    request_id = candidate if candidate and len(candidate) <= 128 and all(c.isalnum() or c in "._:-" for c in candidate) else str(uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    logger.info("request_complete", extra={"request_id": request_id, "method": request.method,
        "path": request.url.path, "status_code": response.status_code})
    return response

app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "Idempotency-Key"])

@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "Request rejected"
    return JSONResponse(status_code=exc.status_code, content={"error": {
        "code": "HTTP_ERROR", "message": message,
        "details": exc.detail if isinstance(exc.detail, dict) else {},
        "request_id": getattr(request.state, "request_id", None)}})

@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"error": {
        "code": "VALIDATION_ERROR", "message": "Request validation failed",
        "details": {"issues": [{"loc": issue.get("loc"), "type": issue.get("type"), "msg": issue.get("msg")} for issue in exc.errors()]},
        "request_id": getattr(request.state, "request_id", None)}})

@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    logger.exception("unhandled_request_error", extra={"request_id": getattr(request.state, "request_id", None)})
    return JSONResponse(status_code=500, content={"error": {
        "code": "INTERNAL_ERROR", "message": "An unexpected error occurred",
        "request_id": getattr(request.state, "request_id", None)}})

@app.get("/health", include_in_schema=False)
async def health():
    return {"status": "ok", "service": "egvox-identity-api"}

app.include_router(identity_router, prefix="/api/v1")
app.include_router(organizations_router, prefix="/api/v1")
