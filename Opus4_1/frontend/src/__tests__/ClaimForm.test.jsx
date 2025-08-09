import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimForm from '../components/ClaimForm';
import { claimsApi } from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('ClaimForm', () => {
  const mockOnClaimCreated = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    expect(screen.getByLabelText(/policy id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/claim amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create claim/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    const submitButton = screen.getByRole('button', { name: /create claim/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/policy id is required/i)).toBeInTheDocument();
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/date is required/i)).toBeInTheDocument();
  });

  test('validates policy ID length', async () => {
    const user = userEvent.setup();
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    const policyIdInput = screen.getByLabelText(/policy id/i);
    await user.type(policyIdInput, 'AB');
    
    const submitButton = screen.getByRole('button', { name: /create claim/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/policy id must be at least 3 characters/i)).toBeInTheDocument();
  });

  test('validates amount range', async () => {
    const user = userEvent.setup();
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    const amountInput = screen.getByLabelText(/claim amount/i);
    
    // Test negative amount
    await user.type(amountInput, '-100');
    
    const submitButton = screen.getByRole('button', { name: /create claim/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
  });

  test('validates description length', async () => {
    const user = userEvent.setup();
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'Short');
    
    const submitButton = screen.getByRole('button', { name: /create claim/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
  });

  test('validates future date', async () => {
    const user = userEvent.setup();
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    const dateInput = screen.getByLabelText(/incident date/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    await user.type(dateInput, futureDate.toISOString().split('T')[0]);
    
    const submitButton = screen.getByRole('button', { name: /create claim/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/date cannot be in the future/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockClaim = {
      id: 1,
      policy_id: 'POL-12345',
      amount: 1500,
      description: 'Test claim description',
      date: '2023-01-01T00:00:00Z',
      status: 'pending'
    };
    
    claimsApi.createClaim.mockResolvedValue(mockClaim);
    
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    // Fill form
    await user.type(screen.getByLabelText(/policy id/i), 'POL-12345');
    await user.type(screen.getByLabelText(/claim amount/i), '1500');
    await user.type(screen.getByLabelText(/incident date/i), '2023-01-01');
    await user.type(screen.getByLabelText(/description/i), 'Test claim description');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create claim/i }));
    
    await waitFor(() => {
      expect(claimsApi.createClaim).toHaveBeenCalledWith({
        policy_id: 'POL-12345',
        amount: 1500,
        description: 'Test claim description',
        date: expect.any(String)
      });
      expect(mockOnClaimCreated).toHaveBeenCalledWith(mockClaim);
    });
  });

  test('handles API error', async () => {
    const user = userEvent.setup();
    claimsApi.createClaim.mockRejectedValue(new Error('API Error'));
    
    render(<ClaimForm onClaimCreated={mockOnClaimCreated} />);
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/policy id/i), 'POL-12345');
    await user.type(screen.getByLabelText(/claim amount/i), '1500');
    await user.type(screen.getByLabelText(/incident date/i), '2023-01-01');
    await user.type(screen.getByLabelText(/description/i), 'Test claim description');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create claim/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
});
