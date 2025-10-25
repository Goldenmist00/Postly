import { useCallback } from 'react';
import { useToastStore } from '@/src/store';
import type { ToastMessage } from '@/src/types';

export const useToast = () => {
  const { toasts, addToast, removeToast, clearToasts } = useToastStore();

  const success = useCallback((title: string, message?: string) => {
    addToast({
      type: 'success',
      title,
      message,
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({
      type: 'error',
      title,
      message,
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({
      type: 'warning',
      title,
      message,
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({
      type: 'info',
      title,
      message,
    });
  }, [addToast]);

  const toast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    addToast(toast);
  }, [addToast]);

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearToasts,
  };
};