"""schema updated

Revision ID: d49a552dea29
Revises: 9582131e6c1f
Create Date: 2025-09-07 16:39:27.830800

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd49a552dea29'
down_revision: Union[str, Sequence[str], None] = '9582131e6c1f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
