"""update medications table

Revision ID: 20260609213454
Revises: 
Create Date: 2026-06-09 21:34:54

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '20260609213454'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old columns
    op.drop_column('medications', 'manufacturer')
    op.drop_column('medications', 'description')
    
    # Rename type to medication_type
    op.alter_column('medications', 'type', new_column_name='medication_type')
    
    # Add new columns
    op.add_column('medications', sa.Column('child_id', postgresql.UUID(as_uuid=True), nullable=False))
    op.add_column('medications', sa.Column('dosage', sa.String(length=100), nullable=False))
    op.add_column('medications', sa.Column('frequency', sa.String(length=100), nullable=False))
    op.add_column('medications', sa.Column('scheduled_time', sa.String(length=10), nullable=True))
    op.add_column('medications', sa.Column('notes', sa.Text(), nullable=True))
    
    # Add foreign key
    op.create_foreign_key('medications_child_id_fkey', 'medications', 'children', ['child_id'], ['id'], ondelete='CASCADE')
    op.create_index('ix_medications_child_id', 'medications', ['child_id'])


def downgrade() -> None:
    # Remove new columns
    op.drop_constraint('medications_child_id_fkey', 'medications', type_='foreignkey')
    op.drop_index('ix_medications_child_id', 'medications')
    op.drop_column('medications', 'notes')
    op.drop_column('medications', 'scheduled_time')
    op.drop_column('medications', 'frequency')
    op.drop_column('medications', 'dosage')
    op.drop_column('medications', 'child_id')
    
    # Rename back
    op.alter_column('medications', 'medication_type', new_column_name='type')
    
    # Add old columns back
    op.add_column('medications', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('medications', sa.Column('manufacturer', sa.String(length=255), nullable=True))
