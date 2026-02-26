"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: Toast["type"], title: string, message: string) => void;
  clearAllToasts: () => void;
  closeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], title: string, message: string) => {
    const newToast: Toast = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast, clearAllToasts, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
