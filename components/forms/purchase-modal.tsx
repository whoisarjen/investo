'use client';

/**
 * Purchase Modal Component
 * Modal wrapper for the add purchase form
 */

import { Modal, ModalHeader, ModalContent } from '@/components/ui';
import { useUI } from '@/contexts';
import { AddPurchaseForm } from './add-purchase-form';

/**
 * Purchase Modal
 * Displays the add purchase form in a modal dialog
 */
export function PurchaseModal() {
  const { addPurchaseModal, closeAddModal, showToast } = useUI();

  /**
   * Handle successful form submission
   */
  const handleSuccess = () => {
    closeAddModal();
    showToast('Investment added successfully', 'success');
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    closeAddModal();
  };

  return (
    <Modal isOpen={addPurchaseModal} onClose={closeAddModal}>
      <ModalHeader onClose={closeAddModal}>
        Add Investment
      </ModalHeader>
      <ModalContent>
        <AddPurchaseForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </ModalContent>
    </Modal>
  );
}
