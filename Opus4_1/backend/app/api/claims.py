# FILE: backend/app/api/claims.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import math

from ..database import get_db
from ..models.claim import Claim, ClaimStatus as ModelClaimStatus
from ..schemas.claim import (
    ClaimCreate, 
    ClaimResponse, 
    ClaimUpdate, 
    ClaimListResponse,
    ClaimStatus
)

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/", response_model=ClaimResponse, status_code=201)
def create_claim(
    claim_data: ClaimCreate,
    db: Session = Depends(get_db)
) -> ClaimResponse:
    """
    Create a new insurance claim.
    
    Args:
        claim_data: Claim creation data
        db: Database session
        
    Returns:
        ClaimResponse: Created claim data
    """
    try:
        # Create new claim instance
        db_claim = Claim(
            policy_id=claim_data.policy_id,
            amount=claim_data.amount,
            description=claim_data.description,
            date=claim_data.date,
            status=ModelClaimStatus.PENDING
        )
        
        # Save to database
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        
        return ClaimResponse.from_orm(db_claim)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to create claim: {str(e)}"
        )

@router.get("/", response_model=ClaimListResponse)
def get_claims(
    status: Optional[ClaimStatus] = Query(None, description="Filter by claim status"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
) -> ClaimListResponse:
    """
    Get paginated list of claims with optional status filter.
    
    Args:
        status: Optional status filter
        page: Page number (1-based)
        per_page: Number of items per page
        db: Database session
        
    Returns:
        ClaimListResponse: Paginated claims data
    """
    try:
        # Build query
        query = db.query(Claim)
        
        # Apply status filter if provided
        if status:
            model_status = ModelClaimStatus(status.value)
            query = query.filter(Claim.status == model_status)
        
        # Get total count
        total = query.count()
        
        # Calculate pagination
        offset = (page - 1) * per_page
        total_pages = math.ceil(total / per_page)
        
        # Get paginated results
        claims = query.order_by(Claim.created_at.desc()).offset(offset).limit(per_page).all()
        
        return ClaimListResponse(
            claims=[ClaimResponse.from_orm(claim) for claim in claims],
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to retrieve claims: {str(e)}"
        )

@router.put("/{claim_id}/approve", response_model=ClaimResponse)
def approve_claim(
    claim_id: int,
    db: Session = Depends(get_db)
) -> ClaimResponse:
    """
    Approve a pending claim.
    
    Args:
        claim_id: ID of the claim to approve
        db: Database session
        
    Returns:
        ClaimResponse: Updated claim data
        
    Raises:
        HTTPException: If claim not found or not pending
    """
    try:
        # Find the claim
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        
        if not claim:
            raise HTTPException(
                status_code=404, 
                detail="Claim not found"
            )
        
        # Check if claim is pending
        if claim.status != ModelClaimStatus.PENDING:
            raise HTTPException(
                status_code=400, 
                detail="Only pending claims can be approved"
            )
        
        # Update status to approved
        claim.status = ModelClaimStatus.APPROVED
        db.commit()
        db.refresh(claim)
        
        return ClaimResponse.from_orm(claim)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to approve claim: {str(e)}"
        )
