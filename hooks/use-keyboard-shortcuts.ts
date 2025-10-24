"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          altKey = false,
          action,
        } = shortcut;

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrlKey &&
          event.metaKey === metaKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey
        ) {
          event.preventDefault();
          action();
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// Common shortcuts
export const createPostShortcuts = (actions: {
  save: () => void;
  preview: () => void;
  publish: () => void;
}) => [
  {
    key: "s",
    ctrlKey: true,
    action: actions.save,
    description: "Save post",
  },
  {
    key: "p",
    ctrlKey: true,
    shiftKey: true,
    action: actions.preview,
    description: "Preview post",
  },
  {
    key: "Enter",
    ctrlKey: true,
    action: actions.publish,
    description: "Publish post",
  },
];