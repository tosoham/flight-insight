import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from alembic import context
import os
from dotenv import load_dotenv

load_dotenv()

# Alembic Config object
config = context.config

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:madhurima@localhost:5433/flightdb")

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import your models
from databases import models
target_metadata = models.Base.metadata


def do_run_migrations(connection: Connection):
    """Synchronous migration runner."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations(connectable: AsyncEngine):
    """Run migrations in async mode."""
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online():
    connectable = config.attributes.get("connection", None)

    if connectable is not None:
        # Already an AsyncConnection passed from init_db.py
        def do_migrations(connection):
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
            )
            with context.begin_transaction():
                context.run_migrations()

        connectable.run_sync(do_migrations)
    else:
        # Fallback: create our own engine if no connection passed
        sqlalchemy_url = config.get_main_option("sqlalchemy.url")
        if sqlalchemy_url is None:
            raise ValueError("sqlalchemy.url is not set in Alembic config file.")
        connectable = create_async_engine(
            sqlalchemy_url,
            poolclass=pool.NullPool,
            future=True,
        )

        async def run():
            async with connectable.connect() as connection:
                await connection.run_sync(do_run_migrations)
            await connectable.dispose()

        asyncio.run(run())



run_migrations_online()
