from contextlib import asynccontextmanager
from uuid import uuid4
import asyncpg
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from shared.config import settings
from domains.identity.api.router import router as identity_router
from domains.organizations.api.router import router as organizations_router

@asynccontextmanager
async def lifespan(app:FastAPI):
    if not settings.database_url: raise RuntimeError("DATABASE_URL is required")
    app.state.pool=await asyncpg.create_pool(settings.database_url,min_size=1,max_size=10,command_timeout=30,server_settings={"application_name":"egvox-identity-api"})
    yield
    await app.state.pool.close()
app=FastAPI(title="EgvoX Identity & Organizations API",version="1.0.0",openapi_url="/api/v1/openapi.json",docs_url="/api/v1/docs",redoc_url=None,lifespan=lifespan)
@app.middleware("http")
async def request_context(request:Request,call_next):
    rid=request.headers.get("x-request-id",str(uuid4()))[:128]
    request.state.request_id=rid
    response=await call_next(request)
    response.headers["X-Request-ID"]=rid
    return response
app.add_middleware(CORSMiddleware,allow_origins=settings.cors_origins,allow_credentials=True,allow_methods=["GET","POST","PATCH","DELETE","OPTIONS"],allow_headers=["Authorization","Content-Type","X-Request-ID","Idempotency-Key"])
@app.exception_handler(Exception)
async def unhandled(request:Request,exc:Exception):
    return JSONResponse(status_code=500,content={"error":{"code":"INTERNAL_ERROR","message":"An unexpected error occurred","request_id":getattr(request.state,"request_id",None)}})
@app.get("/health",include_in_schema=False)
async def health(): return {"status":"ok"}
app.include_router(identity_router,prefix="/api/v1")
app.include_router(organizations_router,prefix="/api/v1")
