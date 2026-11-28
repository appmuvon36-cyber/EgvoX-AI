from functools import lru_cache
from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config=SettingsConfigDict(env_file=".env",extra="ignore",case_sensitive=False)
    supabase_url: AnyHttpUrl
    database_url: str=Field(min_length=1)
    supabase_jwt_audience: str="authenticated"
    supabase_jwt_secret: str|None=None
    supabase_service_role_key: str|None=None
    cors_origins: list[str]=["https://egvox.ai"]
    verification_max_upload_bytes: int=10*1024*1024
    @property
    def issuer(self)->str: return f"{str(self.supabase_url).rstrip('/')}/auth/v1"
    @property
    def jwks_url(self)->str: return f"{self.issuer}/.well-known/jwks.json"
@lru_cache
def get_settings()->Settings: return Settings()
settings=get_settings()
