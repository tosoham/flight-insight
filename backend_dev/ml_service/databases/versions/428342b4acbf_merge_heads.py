"""merge heads

Revision ID: 428342b4acbf
Revises: 2b52402a1b5c, c0cfc4c1df8a
Create Date: 2025-09-07 21:49:56.893099

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '428342b4acbf'
down_revision: Union[str, Sequence[str], None] = ('2b52402a1b5c', 'c0cfc4c1df8a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
