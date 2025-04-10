"""recreate-gt-stats

Revision ID: 9d4367899f90
Revises: e994bc3d79ea
Create Date: 2024-11-01 13:32:24.983227

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "9d4367899f90"
down_revision = "e994bc3d79ea"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index("ix_gt_stats_gt_key", table_name="gt_stats")
    op.drop_table("gt_stats")

    op.create_table(
        "gt_stats",
        sa.Column("task_id", sa.String(), nullable=False),
        sa.Column("gt_frame_name", sa.String(), nullable=False),
        sa.Column("failed_attempts", sa.Integer(), nullable=False),
        sa.Column("accepted_attempts", sa.Integer(), nullable=False),
        sa.Column("accumulated_quality", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["task_id"], ["tasks.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("task_id", "gt_frame_name"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    op.drop_table("gt_stats")
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "gt_stats",
        sa.Column("task_id", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("gt_key", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("failed_attempts", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(
            ["task_id"], ["tasks.id"], name="gt_stats_task_id_fkey", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("task_id", "gt_key", name="gt_stats_pkey"),
    )
    op.create_index("ix_gt_stats_gt_key", "gt_stats", ["gt_key"], unique=False)
    # ### end Alembic commands ###
