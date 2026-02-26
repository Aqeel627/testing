"use client";
import React, { useState, useEffect } from "react";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export interface ToastComponentProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  toast,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 100);
    const hideTimer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onClose(toast.id), 400);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(toast.id), 400);
  };

  const icons = {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
  };

  const toastStyle: React.CSSProperties = {
    marginTop: "15px",
    background: "white",
    borderRadius: "12px",
    padding: "2px 20px 10px",
    marginBottom: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    borderLeft: `5px solid ${
      toast.type === "success"
        ? "#28a745"
        : toast.type === "error"
        ? "#dc3545"
        : toast.type === "info"
        ? "#17a2b8"
        : "#ffc107"
    }`,
    opacity: show ? 1 : 0,
    transform: show ? "translateX(0)" : "translateX(100%)",
    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    position: "relative",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "14px",
    marginRight: "10px",
    color:
      toast.type === "success"
        ? "#28a745"
        : toast.type === "error"
        ? "#dc3545"
        : toast.type === "info"
        ? "#17a2b8"
        : "#856404",
  };

  const closeStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#999",
    padding: "0",
    marginLeft: "auto",
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#333",
    lineHeight: "1.4",
  };

  const progressStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "3px",
    background:
      toast.type === "success"
        ? "#28a745"
        : toast.type === "error"
        ? "#dc3545"
        : toast.type === "info"
        ? "#17a2b8"
        : "#856404",
    animation: "progress 4s linear forwards",
    width: "100%",
  };

  return (
    <div style={toastStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <span
            style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              marginRight: "8px",
              fontWeight: "bold",
            }}
          >
            {icons[toast.type]}
          </span>
          {toast.title}
        </div>
        <button style={closeStyle} onClick={handleClose}>
          &times;
        </button>
      </div>
      <div style={messageStyle}>{toast.message}</div>
      <div style={progressStyle}></div>
    </div>
  );
};

export default ToastComponent