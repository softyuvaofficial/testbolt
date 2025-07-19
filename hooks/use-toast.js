'use client';

import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((props) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      ...props,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);

    return {
      id,
      dismiss: () => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      },
    };
  }, []);

  const dismiss = useCallback((toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};

export { useToast };