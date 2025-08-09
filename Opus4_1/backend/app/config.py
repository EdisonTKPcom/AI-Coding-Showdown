# FILE: backend/app/config.py
import os
from typing import Optional

class Settings:
    """Application configuration settings."""
    
    # Database configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:password@localhost:5432/claimtrack"
    )
    
    # API configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ClaimTrack API"
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 10
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

settings = Settings()
