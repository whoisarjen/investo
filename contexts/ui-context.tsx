'use client';

/**
 * UI Context
 * Provides UI state management for modals and toast notifications
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification object
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Message to display */
  message: string;
  /** Type of toast (determines styling) */
  type: ToastType;
}

/**
 * Edit modal state
 */
interface EditPurchaseModalState {
  /** Whether the modal is open */
  open: boolean;
  /** ID of the purchase being edited, or null if none */
  purchaseId: string | null;
}

/**
 * UI context state and actions
 */
interface UIContextValue {
  /** Add purchase modal open state */
  addPurchaseModal: boolean;
  /** Edit purchase modal state */
  editPurchaseModal: EditPurchaseModalState;
  /** Array of active toast notifications */
  toasts: Toast[];
  /** Open the add purchase modal */
  openAddModal: () => void;
  /** Close the add purchase modal */
  closeAddModal: () => void;
  /** Open the edit purchase modal for a specific purchase */
  openEditModal: (purchaseId: string) => void;
  /** Close the edit purchase modal */
  closeEditModal: () => void;
  /** Show a toast notification */
  showToast: (message: string, type: ToastType) => void;
  /** Dismiss a toast notification by ID */
  dismissToast: (id: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/**
 * Generate a unique ID for toasts
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Props for UIProvider component
 */
interface UIProviderProps {
  children: ReactNode;
}

/**
 * UI Provider Component
 * Wraps the application to provide UI state management
 *
 * @example
 * <UIProvider>
 *   <App />
 * </UIProvider>
 */
export function UIProvider({ children }: UIProviderProps) {
  // Modal state
  const [addPurchaseModal, setAddPurchaseModal] = useState(false);
  const [editPurchaseModal, setEditPurchaseModal] =
    useState<EditPurchaseModalState>({
      open: false,
      purchaseId: null,
    });

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Open the add purchase modal
   */
  const openAddModal = useCallback(() => {
    setAddPurchaseModal(true);
  }, []);

  /**
   * Close the add purchase modal
   */
  const closeAddModal = useCallback(() => {
    setAddPurchaseModal(false);
  }, []);

  /**
   * Open the edit purchase modal for a specific purchase
   */
  const openEditModal = useCallback((purchaseId: string) => {
    setEditPurchaseModal({
      open: true,
      purchaseId,
    });
  }, []);

  /**
   * Close the edit purchase modal
   */
  const closeEditModal = useCallback(() => {
    setEditPurchaseModal({
      open: false,
      purchaseId: null,
    });
  }, []);

  /**
   * Show a toast notification
   * Toast will auto-dismiss after 5 seconds
   */
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = generateToastId();
    const toast: Toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  /**
   * Dismiss a toast notification by ID
   */
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: UIContextValue = {
    addPurchaseModal,
    editPurchaseModal,
    toasts,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    showToast,
    dismissToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * Hook to access UI context
 * Must be used within a UIProvider
 *
 * @returns UI context value with state and actions
 * @throws Error if used outside of UIProvider
 *
 * @example
 * const { openAddModal, showToast, toasts } = useUI();
 */
export function useUI(): UIContextValue {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
}
