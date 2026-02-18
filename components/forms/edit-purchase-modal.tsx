'use client';

/**
 * Edit Purchase Modal Component
 * Modal for editing existing purchases with pre-filled data
 */

import { useState, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { Modal, ModalHeader, ModalContent, Input, Button } from '@/components/ui';
import { useUI, usePortfolio } from '@/contexts';
import { ETFSearch } from './etf-search';
import { DeleteConfirmation } from './delete-confirmation';
import type { PurchaseFormData, Purchase } from '@/types';

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
 * Edit Purchase Modal
 * Pre-fills form with existing purchase data and allows editing
 */
export function EditPurchaseModal() {
  const { editPurchaseModal, closeEditModal, showToast } = useUI();
  const { portfolio, updatePurchase, deletePurchase } = usePortfolio();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Find the purchase being edited
  const purchase: Purchase | undefined = useMemo(() => {
    if (!portfolio || !editPurchaseModal.purchaseId) return undefined;
    return portfolio.purchases.find((p) => p.id === editPurchaseModal.purchaseId);
  }, [portfolio, editPurchaseModal.purchaseId]);

  // Form state initialized from purchase data
  const [formData, setFormData] = useState<PurchaseFormData>(() => ({
    etfSymbol: purchase?.etfSymbol ?? '',
    purchaseDate: purchase?.purchaseDate ?? getTodayDate(),
    shares: purchase?.shares?.toString() ?? '',
    pricePerShare: purchase?.pricePerShare?.toString() ?? '',
    fees: purchase?.fees?.toString() ?? '0',
    notes: purchase?.notes ?? '',
  }));

  // Reset form when purchase changes
  useMemo(() => {
    if (purchase) {
      setFormData({
        etfSymbol: purchase.etfSymbol,
        purchaseDate: purchase.purchaseDate,
        shares: purchase.shares.toString(),
        pricePerShare: purchase.pricePerShare.toString(),
        fees: purchase.fees.toString(),
        notes: purchase.notes ?? '',
      });
      setErrors({});
      setShowDeleteConfirmation(false);
    }
  }, [purchase]);

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

    if (!formData.etfSymbol.trim()) {
      newErrors.etfSymbol = 'ETF symbol is required';
    } else if (!/^[A-Z0-9]{1,10}$/.test(formData.etfSymbol.trim())) {
      newErrors.etfSymbol = 'Invalid symbol format';
    }

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

    const shares = parseFloat(formData.shares);
    if (!formData.shares.trim()) {
      newErrors.shares = 'Number of shares is required';
    } else if (isNaN(shares) || shares <= 0) {
      newErrors.shares = 'Shares must be a positive number';
    }

    const price = parseFloat(formData.pricePerShare);
    if (!formData.pricePerShare.trim()) {
      newErrors.pricePerShare = 'Price per share is required';
    } else if (isNaN(price) || price <= 0) {
      newErrors.pricePerShare = 'Price must be a positive number';
    }

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

    if (!purchase || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      updatePurchase(purchase.id, formData);
      closeEditModal();
      showToast('Investment updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update purchase:', error);
      showToast('Failed to update investment', 'error');
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

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!purchase) return;

    setIsDeleting(true);

    try {
      deletePurchase(purchase.id);
      closeEditModal();
      showToast('Investment deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete purchase:', error);
      showToast('Failed to delete investment', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setShowDeleteConfirmation(false);
    closeEditModal();
  };

  if (!purchase) {
    return null;
  }

  return (
    <Modal isOpen={editPurchaseModal.open} onClose={handleClose}>
      <ModalHeader onClose={handleClose}>
        {showDeleteConfirmation ? 'Confirm Deletion' : 'Edit Investment'}
      </ModalHeader>
      <ModalContent>
        {showDeleteConfirmation ? (
          <DeleteConfirmation
            purchase={purchase}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteConfirmation(false)}
            isDeleting={isDeleting}
          />
        ) : (
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
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={isSubmitting}
              >
                Delete
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
