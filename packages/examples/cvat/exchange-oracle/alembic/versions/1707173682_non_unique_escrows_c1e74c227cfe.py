"""non-unique-escrows

Revision ID: c1e74c227cfe
Revises: 16ecc586d685
Create Date: 2024-02-05 22:54:42.478270

"""

import os

from sqlalchemy import Column, String, delete, func, select
from sqlalchemy.orm import declarative_base

from alembic import op

# revision identifiers, used by Alembic.
revision = "c1e74c227cfe"
down_revision = "16ecc586d685"
branch_labels = None
depends_on = None

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    escrow_address = Column(String(42), unique=False, nullable=False)


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("projects_escrow_address_key", "projects", type_="unique")
    # ### end Alembic commands ###


def downgrade() -> None:
    offline_mode = op.get_context().environment_context.is_offline_mode()
    if not (offline_mode or "TESTING" in os.environ or "test" in op.get_bind().engine.url):
        raise RuntimeError(
            "This downgrade deletes data and should only run in a test environment."
            "If you are sure you want to run it, set the TESTING environment variable."
        )

    op.execute(
        delete(Project).where(
            Project.escrow_address.in_(
                select(Project.escrow_address)
                .group_by(Project.escrow_address)
                .having(func.count(Project.escrow_address) > 1)
            )
        )
    )

    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint("projects_escrow_address_key", "projects", ["escrow_address"])
    # ### end Alembic commands ###
