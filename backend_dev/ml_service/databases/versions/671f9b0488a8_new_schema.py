"""new schema

Revision ID: 671f9b0488a8
Revises: 5823625bf47d
Create Date: 2025-09-07 16:09:19.857982

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '671f9b0488a8'
down_revision: Union[str, Sequence[str], None] = '5823625bf47d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
