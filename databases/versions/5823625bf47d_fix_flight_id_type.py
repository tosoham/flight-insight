"""fix flight_id type

Revision ID: 5823625bf47d
Revises: 0521e3a05c38
Create Date: 2025-09-06 21:24:11.300536
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5823625bf47d"
down_revision: Union[str, Sequence[str], None] = "0521e3a05c38"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Drop FK from bookings → flights
    op.drop_constraint("bookings_flight_id_fkey", "bookings", type_="foreignkey")

    # Change both columns to VARCHAR
    op.alter_column(
        "flights",
        "flight_id",
        existing_type=sa.INTEGER(),
        type_=sa.String(length=10),
        existing_nullable=False,
    )
    op.alter_column(
        "bookings",
        "flight_id",
        existing_type=sa.INTEGER(),
        type_=sa.String(length=10),
        existing_nullable=False,
    )

    # Recreate FK
    op.create_foreign_key(
        "bookings_flight_id_fkey",
        "bookings",
        "flights",
        ["flight_id"],
        ["flight_id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint("bookings_flight_id_fkey", "bookings", type_="foreignkey")

    op.alter_column(
        "bookings",
        "flight_id",
        existing_type=sa.String(length=10),
        type_=sa.INTEGER(),
        existing_nullable=False,
    )
    op.alter_column(
        "flights",
        "flight_id",
        existing_type=sa.String(length=10),
        type_=sa.INTEGER(),
        existing_nullable=False,
    )

    op.create_foreign_key(
        "bookings_flight_id_fkey",
        "bookings",
        "flights",
        ["flight_id"],
        ["flight_id"],
        ondelete="CASCADE",
    )
