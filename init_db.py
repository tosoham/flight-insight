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
    "postgresql+asyncpg://postgres:madhurima@localhost:5433/flightdb"
)

DEFAULT_DB_URL = DATABASE_URL.replace("/flightdb", "/postgres")  # connect to default db
ALEMBIC_INI_PATH = os.path.join(os.path.dirname(__file__), "alembic.ini")


async def ensure_database_exists():
    """Create flightdb if it does not exist."""
    engine = create_async_engine(DEFAULT_DB_URL, isolation_level="AUTOCOMMIT")
    async with engine.connect() as conn:
        from sqlalchemy import text
        result = await conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname='flightdb'")
        )
        exists = result.scalar()
        if not exists:
            print("[INFO] Creating database flightdb...")
            from sqlalchemy import text
            await conn.execute(text('CREATE DATABASE "flightdb";'))
        else:
            print("[INFO] Database flightdb already exists ✅")
    await engine.dispose()


async def init_db():
    """Ensure DB exists, test connection, and run Alembic migrations."""
    print(f"[INFO] Using DATABASE_URL={DATABASE_URL}")

    # Step 1: Ensure DB exists
    await ensure_database_exists()

    # Step 2: Test connection to target DB
    engine = create_async_engine(DATABASE_URL, echo=True)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(lambda c: None)  # simple test query
        print("[INFO] Database connection successful ✅")
    except OperationalError as e:
        print("[ERROR] Could not connect to DB ❌:", e)
        return

    # Step 3: Run Alembic migrations
    print("[INFO] Running Alembic migrations...")
    alembic_cfg = Config(ALEMBIC_INI_PATH)
    async with engine.begin() as conn:
        alembic_cfg.attributes["connection"] = conn
        command.upgrade(alembic_cfg, "head")

    
    await engine.dispose()
    print("[INFO] Database initialized successfully 🎉")


if __name__ == "__main__":
    asyncio.run(init_db())
