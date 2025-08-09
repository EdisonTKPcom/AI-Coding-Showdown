# FILE: backend/app/schemas/claim.py
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional
from enum import Enum

class ClaimStatus(str, Enum):
    """Pydantic enum for claim status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ClaimCreate(BaseModel):
    """Schema for creating a new claim."""
    
    policy_id: str = Field(
        ..., 
        min_length=3, 
        max_length=50,
        description="Insurance policy identifier"
    )
    amount: float = Field(
        ..., 
        gt=0, 
        le=1000000,
        description="Claim amount in dollars"
    )
    description: str = Field(
        ..., 
        min_length=10, 
        max_length=500,
        description="Detailed claim description"
    )
    date: datetime = Field(
        ...,
        description="Date when the claim occurred"
    )
    
    @validator('date')
    def validate_date(cls, v):
        """Ensure claim date is not in the future."""
        if v > datetime.now():
            raise ValueError('Claim date cannot be in the future')
        return v

class ClaimUpdate(BaseModel):
    """Schema for updating claim status."""
    
    status: ClaimStatus = Field(
        ...,
        description="New status for the claim"
    )

class ClaimResponse(BaseModel):
    """Schema for claim response."""
    
    id: int
    policy_id: str
    amount: float
    description: str
    date: datetime
    status: ClaimStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ClaimListResponse(BaseModel):
    """Schema for paginated claim list response."""
    
    claims: List[ClaimResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
