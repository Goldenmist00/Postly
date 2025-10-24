"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Link as LinkIcon, X, Images } from "lucide-react";
import Image from "next/image";
import { ImageGallery } from "./image-gallery";
import { isValidImageUrl } from "@/lib/image-utils";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageData: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    alignment: 'left' | 'center' | 'right';
    caption?: string;
  }) => void;
}

export function ImageEditor({ isOpen, onClose, onInsert }: ImageEditorProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(400);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload' | 'gallery'>('url');
  const [showGallery, setShowGallery] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAlt(file.name.split('.')[0]);
    setUploadMethod('upload');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setUploadMethod('url');
  };

  const handleInsert = () => {
    const finalUrl = uploadMethod === 'url' ? imageUrl : previewUrl;
    
    if (!finalUrl || !alt.trim()) {
      alert("Please provide an image and alt text");
      return;
    }

    onInsert({
      url: finalUrl,
      alt: alt.trim(),
      width,
      height,
      alignment,
      caption: caption.trim() || undefined,
    });

    // Reset form
    setImageUrl("");
    setImageFile(null);
    setPreviewUrl("");
    setAlt("");
    setCaption("");
    setAlignment('center');
    setWidth(600);
    setHeight(400);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl card-modern shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Insert Image
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Method Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <LinkIcon className="w-4 h-4 inline mr-2" />
              URL
            </button>
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'upload'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload
            </button>
            <button
              onClick={() => {
                setUploadMethod('gallery');
                setShowGallery(true);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'gallery'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Images className="w-4 h-4 inline mr-2" />
              Gallery
            </button>
          </div>

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === 'upload' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Image
              </label>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop an image here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supports: JPG, PNG, GIF, WebP (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Preview</h3>
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div 
                  className={`relative mx-auto rounded-lg overflow-hidden shadow-lg ${
                    alignment === 'left' ? 'mr-auto' : 
                    alignment === 'right' ? 'ml-auto' : 'mx-auto'
                  }`}
                  style={{ width: `${Math.min(width, 500)}px`, height: `${Math.min(height, 300)}px` }}
                >
                  {isValidImageUrl(previewUrl) ? (
                    <Image
                      src={previewUrl}
                      alt={alt || "Preview"}
                      fill
                      className="object-cover"
                      onError={() => setPreviewUrl("")}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                      <p className="text-gray-500 dark:text-gray-400">No image selected</p>
                    </div>
                  )}
                </div>
                {caption && (
                  <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 italic ${
                    alignment === 'left' ? 'text-left' : 
                    alignment === 'right' ? 'text-right' : 'text-center'
                  }`}>
                    {caption}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Image Settings */}
          {previewUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Basic Settings</h4>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Describe the image"
                    className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Image caption"
                    className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alignment
                  </label>
                  <div className="flex space-x-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setAlignment(align)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          alignment === align
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {align.charAt(0).toUpperCase() + align.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Size Settings</h4>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="100"
                    max="1200"
                    className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="100"
                    max="800"
                    className="w-full px-3 py-2 glass dark:glass-dark rounded-lg focus-ring text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Quick Size Presets */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quick Sizes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setWidth(400); setHeight(300); }}
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Small (400×300)
                    </button>
                    <button
                      onClick={() => { setWidth(600); setHeight(400); }}
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Medium (600×400)
                    </button>
                    <button
                      onClick={() => { setWidth(800); setHeight(500); }}
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Large (800×500)
                    </button>
                    <button
                      onClick={() => { setWidth(1000); setHeight(600); }}
                      className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      XL (1000×600)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!previewUrl || !alt.trim()}
              className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </div>

        {/* Image Gallery Modal */}
        <ImageGallery
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
          onSelect={(url) => {
            handleUrlChange(url);
            setShowGallery(false);
          }}
        />
      </div>
    </div>
  );
}