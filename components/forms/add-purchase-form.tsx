'use client';

/**
 * Add Purchase Form Component
 * Form for adding new ETF purchases to the portfolio
 */

import { useState, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { Input, Button } from '@/components/ui';
import { ETFSearch } from './etf-search';
import { usePortfolio, useUI } from '@/contexts';
import type { PurchaseFormData } from '@/types';

interface AddPurchaseFormProps {
  /** Callback when form is submitted successfully */
  onSuccess?: () => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
}

interface FormErrors {
  etfSymbol?: string;
  purchaseDate?: string;
  shares?: string;
  pricePerShare?: string;
  fees?: string;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Add Purchase Form
 * Allows users to add new ETF purchases with validation
 */
export function AddPurchaseForm({ onSuccess, onCancel }: AddPurchaseFormProps) {
  const { addPurchase } = usePortfolio();
  const { showToast } = useUI();

  // Form state
  const [formData, setFormData] = useState<PurchaseFormData>({
    etfSymbol: '',
    purchaseDate: getTodayDate(),
    shares: '',
    pricePerShare: '',
    fees: '0',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total cost
  const totalCost = useMemo(() => {
    const shares = parseFloat(formData.shares) || 0;
    const price = parseFloat(formData.pricePerShare) || 0;
    const fees = parseFloat(formData.fees) || 0;
    return shares * price + fees;
  }, [formData.shares, formData.pricePerShare, formData.fees]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ETF Symbol validation
    if (!formData.etfSymbol.trim()) {
      newErrors.etfSymbol = 'ETF symbol is required';
    } else if (!/^[A-Z0-9]{1,10}$/.test(formData.etfSymbol.trim())) {
      newErrors.etfSymbol = 'Invalid symbol format';
    }

    // Purchase date validation
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    } else {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (purchaseDate > today) {
        newErrors.purchaseDate = 'Purchase date cannot be in the future';
      }
    }

    // Shares validation
    const shares = parseFloat(formData.shares);
    if (!formData.shares.trim()) {
      newErrors.shares = 'Number of shares is required';
    } else if (isNaN(shares) || shares <= 0) {
      newErrors.shares = 'Shares must be a positive number';
    }

    // Price per share validation
    const price = parseFloat(formData.pricePerShare);
    if (!formData.pricePerShare.trim()) {
      newErrors.pricePerShare = 'Price per share is required';
    } else if (isNaN(price) || price <= 0) {
      newErrors.pricePerShare = 'Price must be a positive number';
    }

    // Fees validation (optional but must be valid if provided)
    const fees = parseFloat(formData.fees);
    if (formData.fees.trim() && (isNaN(fees) || fees < 0)) {
      newErrors.fees = 'Fees must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      addPurchase(formData);
      showToast('Investment added successfully', 'success');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add purchase:', error);
      showToast('Failed to add investment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handle ETF symbol change
   */
  const handleSymbolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, etfSymbol: value }));
    if (errors.etfSymbol) {
      setErrors((prev) => ({ ...prev, etfSymbol: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ETF Symbol */}
      <ETFSearch
        value={formData.etfSymbol}
        onChange={handleSymbolChange}
        error={errors.etfSymbol}
        disabled={isSubmitting}
      />

      {/* Purchase Date */}
      <Input
        type="date"
        name="purchaseDate"
        label="Purchase Date"
        value={formData.purchaseDate}
        onChange={handleInputChange}
        error={errors.purchaseDate}
        disabled={isSubmitting}
        max={getTodayDate()}
      />

      {/* Number of Shares */}
      <Input
        type="number"
        name="shares"
        label="Number of Shares"
        value={formData.shares}
        onChange={handleInputChange}
        error={errors.shares}
        disabled={isSubmitting}
        placeholder="e.g., 10"
        min="0"
        step="any"
      />

      {/* Price Per Share */}
      <div className="relative">
        <Input
          type="number"
          name="pricePerShare"
          label="Price Per Share"
          value={formData.pricePerShare}
          onChange={handleInputChange}
          error={errors.pricePerShare}
          disabled={isSubmitting}
          placeholder="e.g., 450.00"
          min="0"
          step="0.01"
          className="pl-8"
        />
        <span className="absolute left-3 top-[34px] text-gray-500 dark:text-gray-400">
          $
        </span>
      </div>

      {/* Fees */}
      <div className="relative">
        <Input
          type="number"
          name="fees"
          label="Fees (optional)"
          value={formData.fees}
          onChange={handleInputChange}
          error={errors.fees}
          disabled={isSubmitting}
          placeholder="0.00"
          min="0"
          step="0.01"
          helperText="Transaction fees or commissions"
          className="pl-8"
        />
        <span className="absolute left-3 top-[34px] text-gray-500 dark:text-gray-400">
          $
        </span>
      </div>

      {/* Notes */}
      <div className="w-full">
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Add any notes about this purchase..."
          rows={3}
          className="
            w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm
            transition-colors duration-200
            placeholder:text-gray-400
            focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            dark:border-gray-600 dark:bg-gray-900 dark:placeholder:text-gray-500
            dark:focus:border-blue-400
            dark:disabled:bg-gray-800 dark:disabled:text-gray-400
          "
        />
      </div>

      {/* Total Cost Display */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Cost
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          ({formData.shares || '0'} shares x ${formData.pricePerShare || '0'}) + ${formData.fees || '0'} fees
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Add Investment
        </Button>
      </div>
    </form>
  );
}
