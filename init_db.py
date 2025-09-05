from alembic import command
from alembic.config import Config
from sqlalchemy.ext.asyncio import create_async_engine

__config_path__ = "C:/CTS/alembic.ini"
__migration_path__ = "C:/CTS/databases/env.py"

cfg = Config(__config_path__)
cfg.set_main_option("script_location", __migration_path__)

async def migrate_db(conn_url: str):
    async_engine = create_async_engine(conn_url, echo=True)
    async with async_engine.begin() as conn:
        await conn.run_sync(__execute_upgrade)

def __execute_upgrade(connection):
    cfg.attributes["connection"] = connection
    command.upgrade(cfg, "head")