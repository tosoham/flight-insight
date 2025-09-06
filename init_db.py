import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.exc import OperationalError
from alembic import command
from alembic.config import Config
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:madhurima@localhost:5432/flightdb"
)

ALEMBIC_INI_PATH = os.path.join(os.path.dirname(__file__), "alembic.ini")

async def init_db():
    """Initialize database and run Alembic migrations."""
    print(f"[INFO] Using DATABASE_URL={DATABASE_URL}")

    engine = create_async_engine(DATABASE_URL, echo=True)

    try:
        async with engine.begin() as conn:
            await conn.run_sync(lambda c: None)  # simple test query
        print("[INFO] Database connection successful ✅")
    except OperationalError as e:
        print("[ERROR] Could not connect to DB ❌:", e)
        return

    # Run Alembic migrations
    print("[INFO] Running Alembic migrations...")
    alembic_cfg = Config(ALEMBIC_INI_PATH)
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    command.upgrade(alembic_cfg, "head")

    await engine.dispose()
    print("[INFO] Database initialized successfully 🎉")

if __name__ == "__main__":
    asyncio.run(init_db())
