from __future__ import annotations
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HENRIK_API_KEY: str
    HENRIK_BASE_URL: str = 'https://api.henrikdev.xyz'
    CORS_ORIGINS: str = 'https://vaload.me,http://localhost:5173,http://localhost:5174'
    LOG_LEVEL: str = 'INFO'
    DISCORD_WEBHOOK_URL: str | None = None
    model_config = {'env_file': '.env', 'env_file_encoding': 'utf-8', 'case_sensitive': True}

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(',') if o.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()