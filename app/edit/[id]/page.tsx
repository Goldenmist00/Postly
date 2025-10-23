"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { trpc } from "@/src/utils/trpc";
import Link from "next/link";
import { ArrowLeft, Eye, Save, Settings, Image as ImageIcon } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = parseInt(params.id as string);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const { data: post, isLoading } = trpc.posts.getById.useQuery({ id: postId });
  const { data: categories } = trpc.categories.getAll.useQuery();
  const updatePost = trpc.posts.update.useMutation({
    onSuccess: (data) => {
      router.push(`/posts/${data.slug}`);
    },
    onError: (error) => {
      alert("Failed to update post: " + error.message);
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author || "");
      setImage(post.image || "");
      setPublished(post.published || false);
      setSelectedCategories(post.categories?.map(c => c.id) || []);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    updatePost.mutate({
      id: postId,
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || undefined,
      image: image.trim() || undefined,
      published,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  };

  if (isLoading) {
    return (
      <>
        {/* Loading Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Post Not Found</h1>
            </div>
          </div>
        </div>
        
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">The post you're trying to edit doesn't exist.</p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Blogger-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Post Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={updatePost.isPending || !title.trim() || !content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {updatePost.isPending ? "Updating..." : published ? "Update & Publish" : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            
            {/* Main Editor */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Title Input */}
                <div className="p-6 border-b border-gray-100">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none"
                    style={{ fontFamily: 'inherit' }}
                  />
                </div>

                {/* Featured Image */}
                {image && (
                  <div className="relative">
                    <img 
                      src={image} 
                      alt="Featured" 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content Editor */}
                <div className="p-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell your story..."
                    className="w-full min-h-[500px] text-lg text-gray-900 placeholder-gray-400 border-none outline-none resize-none leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif' }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Publish Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
                
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
                      Published
                    </label>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {published ? "Post is visible to readers" : "Post is saved as draft"}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Author</h3>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Featured Image
                </h3>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="text-xs text-gray-500 mt-2">
                  Add a cover image to make your post stand out
                </div>
              </div>

              {/* Categories */}
              {categories && categories.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  
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
    </>
  );
}