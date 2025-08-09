import React, { useState } from 'react';
import { claimsApi } from '../services/api';

const ClaimTable = ({ claims, onClaimApproved, isLoading }) => {
  const [approvingClaims, setApprovingClaims] = useState(new Set());

  /**
   * Handle claim approval
   */
  const handleApproveClaim = async (claimId) => {
    setApprovingClaims(prev => new Set(prev).add(claimId));
    
    try {
      const updatedClaim = await claimsApi.approveClaim(claimId);
      onClaimApproved?.(updatedClaim);
    } catch (error) {
      alert(`Failed to approve claim: ${error.message}`);
    } finally {
      setApprovingClaims(prev => {
        const newSet = new Set(prev);
        newSet.delete(claimId);
        return newSet;
      });
    }
  };

  /**
   * Format currency amount
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Get status badge classes
   */
  const getStatusBadgeClass = (status) => {
    const baseClass = 'status-badge';
    switch (status) {
      case 'pending':
        return `${baseClass} status-pending`;
      case 'approved':
        return `${baseClass} status-approved`;
      case 'rejected':
        return `${baseClass} status-rejected`;
      default:
        return baseClass;
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No claims found
          </h3>
          <p className="text-gray-500">
            Create your first claim using the form above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Claims List
        </h2>
        <div className="text-sm text-gray-500">
          {claims.length} claim{claims.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Policy ID</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Date</th>
              <th className="table-header">Status</th>
              <th className="table-header">Description</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="font-medium">{claim.policy_id}</div>
                  <div className="text-xs text-gray-500">
                    ID: {claim.id}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="font-medium">
                    {formatCurrency(claim.amount)}
                  </div>
                </td>
                <td className="table-cell">
                  <div>{formatDate(claim.date)}</div>
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(claim.created_at)}
                  </div>
                </td>
                <td className="table-cell">
                  <span className={getStatusBadgeClass(claim.status)}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </td>
                <td className="table-cell max-w-xs">
                  <div className="truncate" title={claim.description}>
                    {claim.description}
                  </div>
                </td>
                <td className="table-cell">
                  {claim.status === 'pending' && (
                    <button
                      onClick={() => handleApproveClaim(claim.id)}
                      disabled={approvingClaims.has(claim.id)}
                      className={`btn btn-success text-sm ${
                        approvingClaims.has(claim.id) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {approvingClaims.has(claim.id) ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                  {claim.status === 'approved' && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Approved
                    </span>
                  )}
                  {claim.status === 'rejected' && (
                    <span className="text-sm text-red-600 font-medium">
                      ✗ Rejected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimTable;
