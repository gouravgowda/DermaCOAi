from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./dermascope.db"

    # Replicate API (cloud ML fallback)
    REPLICATE_API_TOKEN: str = ""

    # Cloudflare R2
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "dermascope-images"

    # Feature flags
    MOCK_ML: bool = True  # Use mock inference when True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
