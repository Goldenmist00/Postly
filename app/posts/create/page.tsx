"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/src/utils/trpc";
import Navigation from "@/components/navigation";
import Link from "next/link";
import Image from "next/image";
import { PostPreviewModal } from "@/components/post-preview-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { DraftRestorationModal } from "@/components/draft-restoration-modal";
import { calculateReadingTime, formatReadingTime, getWordCount } from "@/lib/post-utils";
import { isValidImageUrl } from "@/lib/image-utils";
import { useToast, ToastContainer } from "@/components/toast";
import { useKeyboardShortcuts, createPostShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAutoSave } from "@/hooks/use-auto-save";
import { ArrowLeft, Eye, Save, Settings, Image as ImageIcon, Clock, FileText, Keyboard, Type } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [editorMode, setEditorMode] = useState<'simple' | 'rich'>('rich');
  const [draftRestored, setDraftRestored] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [savedDraft, setSavedDraft] = useState<any>(null);

  const { toasts, removeToast, success, error: showError, info } = useToast();

  const { data: categories } = trpc.categories.getAll.useQuery();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: (data) => {
      success("Post created successfully!", `"${data.title}" has been ${published ? 'published' : 'saved as draft'}.`);
      setIsDirty(false);
      // Clear the draft since post was successfully created
      localStorage.removeItem('postly-draft');
      setTimeout(() => {
        router.push(`/posts/${data.slug}`);
      }, 1000);
    },
    onError: (error) => {
      showError("Failed to create post", error.message);
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      showError("Missing required fields", "Title and content are required");
      return;
    }

    info("Creating post...", "Please wait while we save your post.");

    createPost.mutate({
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || undefined,
      image: image.trim() || undefined,
      published,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  };

  // Auto-save draft functionality
  const autoSaveData = {
    title,
    content,
    author,
    image,
    selectedCategories,
  };

  const { isSaving } = useAutoSave({
    data: autoSaveData,
    onSave: async (data) => {
      // Only save if there's actual content and we're not in initial load
      if (!data.title.trim() && !data.content.trim()) return;
      if (initialLoad || draftRestored) return;
      
      // Save to localStorage as backup
      localStorage.setItem('postly-draft', JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }));
    },
    delay: 3000,
    enabled: isDirty && Boolean(title.trim() || content.trim()) && !initialLoad && !draftRestored,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts(createPostShortcuts({
    save: () => handleSubmit(),
    preview: () => setShowPreview(true),
    publish: () => {
      setPublished(true);
      setTimeout(() => handleSubmit(), 100);
    },
  }));

  // Load draft from localStorage on mount (only once)
  useEffect(() => {
    if (!initialLoad) return;
    
    const draftData = localStorage.getItem('postly-draft');
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        const isRecent = Date.now() - draft.timestamp < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent && (draft.title || draft.content)) {
          setSavedDraft(draft);
          setShowDraftModal(true);
        } else {
          // Remove old draft
          localStorage.removeItem('postly-draft');
        }
      } catch (error) {
        console.error("Failed to restore draft:", error);
        localStorage.removeItem('postly-draft');
      }
    }
    
    setInitialLoad(false);
  }, [initialLoad]);

  // Track changes (but not during initial load or draft restoration)
  useEffect(() => {
    if (initialLoad || draftRestored) {
      if (draftRestored) {
        setDraftRestored(false);
      }
      return;
    }
    setIsDirty(true);
  }, [title, content, author, image, selectedCategories, published, initialLoad, draftRestored]);

  // Draft modal handlers
  const handleRestoreDraft = () => {
    if (savedDraft) {
      setTitle(savedDraft.title || "");
      setContent(savedDraft.content || "");
      setAuthor(savedDraft.author || "");
      setImage(savedDraft.image || "");
      setSelectedCategories(savedDraft.selectedCategories || []);
      setDraftRestored(true);
      setShowDraftModal(false);
      info("Draft restored", "Your previous work has been restored.");
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('postly-draft');
    setShowDraftModal(false);
    setSavedDraft(null);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && (title.trim() || content.trim())) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, title, content]);

  return (
    <>
      {/* Blogger-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">New Post</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Saving...</span>
                </div>
              )}
              
              {isDirty && !isSaving && (title.trim() || content.trim()) && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Unsaved changes</span>
                  <button
                    onClick={() => {
                      if (confirm("Clear all content and start fresh?")) {
                        setTitle("");
                        setContent("");
                        setAuthor("");
                        setImage("");
                        setSelectedCategories([]);
                        setIsDirty(false);
                        localStorage.removeItem('postly-draft');
                        success("Draft cleared", "Starting with a fresh post.");
                      }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 underline ml-2"
                  >
                    Clear Draft
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Post Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={createPost.isPending || !title.trim() || !content.trim()}
                className="btn-gradient flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {createPost.isPending ? "Publishing..." : published ? "Publish" : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="page-bg-alt min-h-screen writing-mode">
        <div className="writing-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-4 lg:p-6">
            
            {/* Main Editor */}
            <div className="lg:col-span-3 xl:col-span-4 order-2 lg:order-1">
              <div className="card-modern overflow-hidden animate-in shadow-xl">
                
                {/* Title Input */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Write your story title..."
                    className="w-full text-4xl lg:text-5xl font-bold text-primary placeholder-gray-400 dark:placeholder-slate-500 border-none outline-none resize-none bg-transparent leading-tight writing-title writing-content"
                    style={{ fontFamily: 'Georgia, serif' }}
                  />
                </div>

                {/* Featured Image */}
                {isValidImageUrl(image) && (
                  <div className="relative">
                    <div className="relative w-full h-64">
                      <Image 
                        src={image} 
                        alt="Featured" 
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Editor Mode Toggle */}
                <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setEditorMode('rich')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          editorMode === 'rich'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <Type className="w-4 h-4" />
                        Rich Editor
                      </button>
                      <button
                        onClick={() => setEditorMode('simple')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          editorMode === 'simple'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Simple
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {editorMode === 'rich' ? 'Rich text with formatting tools' : 'Plain text editor'}
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="p-0">
                  {editorMode === 'rich' ? (
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your story... The editor will expand as you write."
                      className="text-xl leading-relaxed focus:outline-none"
                    />
                  ) : (
                    <div className="p-8">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your story... The editor will expand as you write."
                        className="w-full text-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-none outline-none resize-none leading-relaxed bg-transparent"
                        style={{ 
                          fontFamily: 'Georgia, serif',
                          minHeight: 'calc(100vh - 400px)',
                          lineHeight: '1.8'
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${Math.max(target.scrollHeight, window.innerHeight - 400)}px`;
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 xl:col-span-1 order-1 lg:order-2 space-y-4 md:space-y-6">
              
              {/* Publish Settings */}
              <div className="card-modern p-6">
                <h3 className="font-semibold text-primary mb-4">Publish</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publish immediately
                    </label>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {published ? "Post will be visible to readers" : "Post will be saved as draft"}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="card-modern p-6">
                <h3 className="font-semibold text-primary mb-4">Author</h3>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="input-modern w-full text-sm"
                />
              </div>

              {/* Featured Image */}
              <div className="card-modern p-6">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Featured Image <span className="text-sm font-normal text-gray-500">(optional)</span>
                </h3>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL (optional)"
                  className="input-modern w-full text-sm"
                />
                <div className="text-xs text-gray-500 mt-2">
                  Add a cover image to make your post stand out (optional)
                </div>
              </div>

              {/* Post Statistics */}
              <div className="card-modern p-6">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Post Statistics
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Word Count:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {content ? getWordCount(content) : 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Reading Time:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {content ? formatReadingTime(calculateReadingTime(content)) : "0 min read"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Characters:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {content ? content.length : 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {categories && categories.length > 0 && (
                <div className="card-modern p-6">
                  <h3 className="font-semibold text-primary mb-4">Categories</h3>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                      {selectedCategories.map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        return category ? (
                          <span key={categoryId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {category.name}
                            <button
                              type="button"
                              onClick={() => setSelectedCategories(selectedCategories.filter(id => id !== categoryId))}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <PostPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        content={content}
        author={author}
        image={image}
        categories={categories?.filter(cat => selectedCategories.includes(cat.id)) || []}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Save post</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Preview post</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + Shift + P</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Publish post</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl + Enter</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Draft Restoration Modal */}
      {savedDraft && (
        <DraftRestorationModal
          isOpen={showDraftModal}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          draftData={savedDraft}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}