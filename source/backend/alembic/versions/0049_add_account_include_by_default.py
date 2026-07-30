"""Add accounts.include_by_default

Revision ID: 0049
Revises: 0048
Create Date: 2026-07-30 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0049"
down_revision: Union[str, None] = "0048"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "accounts",
        sa.Column("include_by_default", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    # Existing accounts opt in by default so behaviour is unchanged until a user opts one out.
    op.execute("UPDATE accounts SET include_by_default = 1")


def downgrade() -> None:
    op.drop_column("accounts", "include_by_default")
