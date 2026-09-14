"""Rename transfer_flows (Geldfluss) to related_groups: a group links related transactions, not only money flows

Revision ID: 0069
Revises: 0068
Create Date: 2026-09-14 18:00:00.000000
"""

from typing import Sequence, Union

from alembic import op

revision: str = "0069"
down_revision: Union[str, None] = "0068"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.rename_table("transfer_flows", "related_groups")
    op.drop_index("ix_transactions_flow_id", table_name="transactions")
    with op.batch_alter_table("transactions") as batch:
        batch.alter_column("flow_id", new_column_name="related_group_id")
        batch.alter_column("flow_link_source", new_column_name="related_link_source")
    op.create_index("ix_transactions_related_group_id", "transactions", ["related_group_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_transactions_related_group_id", table_name="transactions")
    with op.batch_alter_table("transactions") as batch:
        batch.alter_column("related_group_id", new_column_name="flow_id")
        batch.alter_column("related_link_source", new_column_name="flow_link_source")
    op.create_index("ix_transactions_flow_id", "transactions", ["flow_id"], unique=False)
    op.rename_table("related_groups", "transfer_flows")
