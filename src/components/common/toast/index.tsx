"use client";
import React from "react";
import ReactDOM from "react-dom";
import { useToast } from "./toast-context";
import dynamic from "next/dynamic";

// Dynamically import ToastComponent (client only)
const ToastComponent = dynamic(() => import("./toast-container"), {
  ssr: false,
});

export const ToastContainer: React.FC = () => {
  const { toasts, closeToast } = useToast();

  // --- FIX #1: Only render Portal after mount ---
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return ReactDOM.createPortal(
    <>
      <style>
        {`
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>

      <div
        id="global-toast-container"
        style={{
          position: "fixed",
          top: "-5px",
          right: "5px",
          minWidth: "300px",
          zIndex: 2147483647,
          maxWidth: "400px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <ToastComponent toast={toast} onClose={closeToast} />
          </div>
        ))}
      </div>
    </>,
    document.body
  );
};
