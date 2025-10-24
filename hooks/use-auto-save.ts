"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ data, onSave, delay = 2000, enabled = true }: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string | undefined>(undefined);
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;
    
    const currentData = JSON.stringify(data);
    if (currentData === lastSavedRef.current) return;

    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedRef.current = currentData;
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, delay, enabled]);

  return {
    isSaving: isSavingRef.current,
    forceSave: save,
  };
}