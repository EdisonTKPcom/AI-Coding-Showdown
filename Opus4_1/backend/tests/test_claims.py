# FILE: backend/tests/test_claims.py
import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient

def test_create_claim(client: TestClient):
    """Test creating a new claim."""
    claim_data = {
        "policy_id": "POL-12345",
        "amount": 1500.00,
        "description": "Car accident damage to front bumper and headlight",
        "date": (datetime.now() - timedelta(days=1)).isoformat()
    }
    
    response = client.post("/api/v1/claims/", json=claim_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["policy_id"] == claim_data["policy_id"]
    assert data["amount"] == claim_data["amount"]
    assert data["status"] == "pending"
    assert "id" in data

def test_create_claim_invalid_data(client: TestClient):
    """Test creating claim with invalid data."""
    claim_data = {
        "policy_id": "AB",  # Too short
        "amount": -100,  # Negative amount
        "description": "Short",  # Too short
        "date": (datetime.now() + timedelta(days=1)).isoformat()  # Future date
    }
    
    response = client.post("/api/v1/claims/", json=claim_data)
    assert response.status_code == 422

def test_get_claims_empty(client: TestClient):
    """Test getting claims when database is empty."""
    response = client.get("/api/v1/claims/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["claims"] == []
    assert data["total"] == 0
    assert data["page"] == 1

def test_get_claims_with_data(client: TestClient):
    """Test getting claims with data."""
    # Create a claim first
    claim_data = {
        "policy_id": "POL-12345",
        "amount": 1500.00,
        "description": "Car accident damage to front bumper and headlight",
        "date": (datetime.now() - timedelta(days=1)).isoformat()
    }
    
    create_response = client.post("/api/v1/claims/", json=claim_data)
    assert create_response.status_code == 201
    
    # Get claims
    response = client.get("/api/v1/claims/")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["claims"]) == 1
    assert data["total"] == 1
    assert data["claims"][0]["policy_id"] == claim_data["policy_id"]

def test_get_claims_with_status_filter(client: TestClient):
    """Test getting claims with status filter."""
    # Create a claim
    claim_data = {
        "policy_id": "POL-12345",
        "amount": 1500.00,
        "description": "Car accident damage to front bumper and headlight",
        "date": (datetime.now() - timedelta(days=1)).isoformat()
    }
    
    create_response = client.post("/api/v1/claims/", json=claim_data)
    assert create_response.status_code == 201
    
    # Test filter by pending status
    response = client.get("/api/v1/claims/?status=pending")
    assert response.status_code == 200
    data = response.json()
    assert len(data["claims"]) == 1
    
    # Test filter by approved status (should be empty)
    response = client.get("/api/v1/claims/?status=approved")
    assert response.status_code == 200
    data = response.json()
    assert len(data["claims"]) == 0

def test_approve_claim(client: TestClient):
    """Test approving a pending claim."""
    # Create a claim first
    claim_data = {
        "policy_id": "POL-12345",
        "amount": 1500.00,
        "description": "Car accident damage to front bumper and headlight",
        "date": (datetime.now() - timedelta(days=1)).isoformat()
    }
    
    create_response = client.post("/api/v1/claims/", json=claim_data)
    assert create_response.status_code == 201
    claim_id = create_response.json()["id"]
    
    # Approve the claim
    response = client.put(f"/api/v1/claims/{claim_id}/approve")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["id"] == claim_id

def test_approve_nonexistent_claim(client: TestClient):
    """Test approving a non-existent claim."""
    response = client.put("/api/v1/claims/999/approve")
    
    assert response.status_code == 404
    assert "Claim not found" in response.json()["detail"]

def test_approve_already_approved_claim(client: TestClient):
    """Test approving an already approved claim."""
    # Create and approve a claim
    claim_data = {
        "policy_id": "POL-12345",
        "amount": 1500.00,
        "description": "Car accident damage to front bumper and headlight",
        "date": (datetime.now() - timedelta(days=1)).isoformat()
    }
    
    create_response = client.post("/api/v1/claims/", json=claim_data)
    claim_id = create_response.json()["id"]
    
    # First approval
    client.put(f"/api/v1/claims/{claim_id}/approve")
    
    # Try to approve again
    response = client.put(f"/api/v1/claims/{claim_id}/approve")
    
    assert response.status_code == 400
    assert "Only pending claims can be approved" in response.json()["detail"]

def test_pagination(client: TestClient):
    """Test pagination functionality."""
    # Create multiple claims
    for i in range(15):
        claim_data = {
            "policy_id": f"POL-{i:05d}",
            "amount": 1000.00 + i,
            "description": f"Test claim number {i} with detailed description",
            "date": (datetime.now() - timedelta(days=i)).isoformat()
        }
        client.post("/api/v1/claims/", json=claim_data)
    
    # Test first page
    response = client.get("/api/v1/claims/?page=1&per_page=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["claims"]) == 10
    assert data["total"] == 15
    assert data["page"] == 1
    assert data["total_pages"] == 2
    
    # Test second page
    response = client.get("/api/v1/claims/?page=2&per_page=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["claims"]) == 5
    assert data["page"] == 2

def test_health_endpoint(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
