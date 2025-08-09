import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimTable from '../components/ClaimTable';
import { claimsApi } from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('ClaimTable', () => {
  const mockOnClaimApproved = jest.fn();
  
  const mockClaims = [
    {
      id: 1,
      policy_id: 'POL-12345',
      amount: 1500,
      description: 'Car accident damage',
      date: '2023-01-01T00:00:00Z',
      status: 'pending',
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-01-01T10:00:00Z'
    },
    {
      id: 2,
      policy_id: 'POL-67890',
      amount: 2500,
      description: 'Home damage from storm',
      date: '2023-01-02T00:00:00Z',
      status: 'approved',
      created_at: '2023-01-02T10:00:00Z',
      updated_at: '2023-01-02T11:00:00Z'
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    render(<ClaimTable claims={[]} onClaimApproved={mockOnClaimApproved} isLoading={true} />);
    
    expect(screen.getByRole('generic')).toHaveClass('animate-pulse');
  });

  test('renders empty state when no claims', () => {
    render(<ClaimTable claims={[]} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    expect(screen.getByText(/no claims found/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first claim/i)).toBeInTheDocument();
  });

  test('renders claims data correctly', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    // Check table headers
    expect(screen.getByText(/policy id/i)).toBeInTheDocument();
    expect(screen.getByText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
    
    // Check claim data
    expect(screen.getByText('POL-12345')).toBeInTheDocument();
    expect(screen.getByText('POL-67890')).toBeInTheDocument();
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
    expect(screen.getByText('Car accident damage')).toBeInTheDocument();
    expect(screen.getByText('Home damage from storm')).toBeInTheDocument();
  });

  test('renders correct status badges', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    const pendingBadge = screen.getByText('Pending');
    const approvedBadge = screen.getByText('Approved');
    
    expect(pendingBadge).toHaveClass('status-pending');
    expect(approvedBadge).toHaveClass('status-approved');
  });

  test('shows approve button for pending claims', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    const approveButton = screen.getByText('Approve');
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).toBeEnabled();
  });

  test('shows approved status for approved claims', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    expect(screen.getByText('✓ Approved')).toBeInTheDocument();
  });

  test('handles claim approval', async () => {
    const user = userEvent.setup();
    const updatedClaim = { ...mockClaims[0], status: 'approved' };
    claimsApi.approveClaim.mockResolvedValue(updatedClaim);
    
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    const approveButton = screen.getByText('Approve');
    await user.click(approveButton);
    
    await waitFor(() => {
      expect(claimsApi.approveClaim).toHaveBeenCalledWith(1);
      expect(mockOnClaimApproved).toHaveBeenCalledWith(updatedClaim);
    });
  });

  test('handles approval error', async () => {
    const user = userEvent.setup();
    claimsApi.approveClaim.mockRejectedValue(new Error('Approval failed'));
    
    // Mock window.alert
    window.alert = jest.fn();
    
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    const approveButton = screen.getByText('Approve');
    await user.click(approveButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to approve claim: Approval failed');
    });
  });

  test('disables approve button during approval process', async () => {
    const user = userEvent.setup();
    // Mock a delayed response
    claimsApi.approveClaim.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    const approveButton = screen.getByText('Approve');
    await user.click(approveButton);
    
    // Button should show "Approving..." and be disabled
    expect(screen.getByText('Approving...')).toBeInTheDocument();
    expect(screen.getByText('Approving...')).toBeDisabled();
  });

  test('formats currency correctly', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
  });

  test('formats dates correctly', () => {
    render(<ClaimTable claims={mockClaims} onClaimApproved={mockOnClaimApproved} isLoading={false} />);
    
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2023')).toBeInTheDocument();
  });
});
