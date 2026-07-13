from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AttackChain AI Backend"
    version: str = "1.0.0"
    anthropic_api_key: str = ""
    database_url: str = "sqlite:///./attackchain.db"

    class Config:
        env_file = ".env"

settings = Settings()
