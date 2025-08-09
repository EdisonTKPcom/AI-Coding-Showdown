# FILE: backend/app/models/claim.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from datetime import datetime

from ..database import Base

class ClaimStatus(PyEnum):
    """Enumeration for claim status values."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Claim(Base):
    """
    SQLAlchemy model for insurance claims.
    
    Attributes:
        id: Primary key
        policy_id: Insurance policy identifier
        amount: Claim amount in dollars
        description: Claim description
        date: Date when claim occurred
        status: Current claim status
        created_at: Timestamp when claim was created
        updated_at: Timestamp when claim was last updated
    """
    
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(String(50), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String(500), nullable=False)
    date = Column(DateTime, nullable=False)
    status = Column(
        Enum(ClaimStatus), 
        default=ClaimStatus.PENDING, 
        nullable=False
    )
    created_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    def __repr__(self) -> str:
        return f"<Claim(id={self.id}, policy_id={self.policy_id}, amount={self.amount})>"
