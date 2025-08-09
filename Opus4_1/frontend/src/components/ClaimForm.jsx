import React, { useState } from 'react';
import { claimsApi } from '../services/api';

const ClaimForm = ({ onClaimCreated }) => {
  const [formData, setFormData] = useState({
    policy_id: '',
    amount: '',
    description: '',
    date: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes with validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Policy ID validation
    if (!formData.policy_id.trim()) {
      newErrors.policy_id = 'Policy ID is required';
    } else if (formData.policy_id.length < 3) {
      newErrors.policy_id = 'Policy ID must be at least 3 characters';
    }
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'Amount cannot exceed $1,000,000';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    return newErrors;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Convert amount to number and format date
      const claimData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };
      
      const newClaim = await claimsApi.createClaim(claimData);
      
      // Reset form
      setFormData({
        policy_id: '',
        amount: '',
        description: '',
        date: '',
      });
      
      // Notify parent component
      onClaimCreated?.(newClaim);
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Create New Claim
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Policy ID */}
        <div>
          <label htmlFor="policy_id" className="form-label">
            Policy ID *
          </label>
          <input
            type="text"
            id="policy_id"
            name="policy_id"
            value={formData.policy_id}
            onChange={handleChange}
            className={`form-input ${errors.policy_id ? 'border-red-500' : ''}`}
            placeholder="Enter policy ID (e.g., POL-12345)"
          />
          {errors.policy_id && (
            <p className="mt-1 text-sm text-red-600">{errors.policy_id}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="form-label">
            Claim Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            max="1000000"
            step="0.01"
            className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="form-label">
            Incident Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`form-input ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`form-input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Describe the incident and damages in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating...' : 'Create Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;
