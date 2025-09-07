"""schema update

Revision ID: 9582131e6c1f
Revises: 671f9b0488a8
Create Date: 2025-09-07 16:34:33.317304

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9582131e6c1f'
down_revision: Union[str, Sequence[str], None] = '671f9b0488a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
