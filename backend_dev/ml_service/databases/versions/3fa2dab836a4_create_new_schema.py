"""create new schema

Revision ID: 3fa2dab836a4
Revises: d49a552dea29
Create Date: 2025-09-07 16:50:09.060831

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3fa2dab836a4'
down_revision: Union[str, Sequence[str], None] = 'd49a552dea29'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
