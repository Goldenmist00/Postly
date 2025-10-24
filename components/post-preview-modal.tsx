"use client";

import { X, Calendar, User, Clock } from "lucide-react";
import Image from "next/image";
import { calculateReadingTime, formatReadingTime, getWordCount } from "@/lib/post-utils";

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  author: string;
  image?: string;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

export function PostPreviewModal({
  isOpen,
  onClose,
  title,
  content,
  author,
  image,
  categories = [],
}: PostPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Post Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-8">
            {/* Post header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title || "Untitled Post"}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{author || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {content && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatReadingTime(calculateReadingTime(content))}</span>
                  </div>
                )}
                {content && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{getWordCount(content)} words</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured image */}
            {image && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={image}
                  alt={title || "Featured image"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Post content */}
            <article className="prose prose-gray dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed">
                {content || "No content yet..."}
              </div>
            </article>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <span
                      key={category.id}
                      className={`text-sm px-3 py-1 rounded-full ${
                        index % 3 === 0
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : index % 3 === 1
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}