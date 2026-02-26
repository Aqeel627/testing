"use client";

import { useEffect } from "react";
import { useToast } from "./toast-context";
import { setInjectedToast } from "@/lib/toastinjector";

export function ToastConnector() {
  const { showToast } = useToast();

  useEffect(() => {
    setInjectedToast((msg: string) => {
      showToast("error", "Error", msg);
    });
  }, []);

  return null;
}
