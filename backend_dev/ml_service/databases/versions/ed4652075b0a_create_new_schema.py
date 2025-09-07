"""create new schema

Revision ID: ed4652075b0a
Revises: 3fa2dab836a4
Create Date: 2025-09-07 16:50:42.539912

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed4652075b0a'
down_revision: Union[str, Sequence[str], None] = '3fa2dab836a4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
