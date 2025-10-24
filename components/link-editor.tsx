"use client";

import { useState } from "react";
import { X, Link as LinkIcon, ExternalLink } from "lucide-react";

interface LinkEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  selectedText?: string;
}

export function LinkEditor({ isOpen, onClose, onInsert, selectedText }: LinkEditorProps) {
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState(selectedText || "");

  if (!isOpen) return null;

  const handleInsert = () => {
    if (!url.trim()) return;
    
    onInsert(url.trim(), linkText.trim() || undefined);
    setUrl("");
    setLinkText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInsert();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md card-modern shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Insert Link
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link Text {selectedText ? "(optional)" : "*"}
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedText ? "Use selected text" : "Enter link text"}
              className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
            />
          </div>

          {url && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400 underline">
                  {linkText || selectedText || url}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!url.trim() || (!linkText.trim() && !selectedText)}
              className="flex-1 btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}