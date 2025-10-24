"use client";

import { FileText, X, Clock } from "lucide-react";

interface DraftRestorationModalProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  draftData: {
    title?: string;
    content?: string;
    timestamp: number;
  };
}

export function DraftRestorationModal({ 
  isOpen, 
  onRestore, 
  onDiscard, 
  draftData 
}: DraftRestorationModalProps) {
  if (!isOpen) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md card-modern shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Draft Found
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Saved {formatTime(draftData.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              {draftData.title && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                    {draftData.title}
                  </p>
                </div>
              )}
              {draftData.content && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Content:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {draftData.content.substring(0, 150)}
                    {draftData.content.length > 150 && "..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            We found a recent draft of your work. Would you like to restore it or start fresh?
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onDiscard}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Start Fresh
            </button>
            <button
              onClick={onRestore}
              className="flex-1 btn-gradient"
            >
              Restore Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}