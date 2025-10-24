"use client";

import { trpc } from "@/src/utils/trpc";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { DashboardPostSkeleton } from "@/components/skeletons";
import { useToast, ToastContainer } from "@/components/toast";
import { useConfirmation } from "@/components/confirmation-modal";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function DashboardPage() {
  const { data: posts, isLoading, refetch } = trpc.posts.getAll.useQuery();
  const { toasts, removeToast, success, error: showError } = useToast();
  const { confirm, ConfirmationDialog } = useConfirmation();
  
  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: (_, variables) => {
      success("Post deleted", `Post has been permanently deleted.`);
      refetch();
    },
    onError: (error) => {
      showError("Failed to delete post", error.message);
    },
  });

  const handleDelete = (id: number, title: string) => {
    confirm({
      title: "Delete Post",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        deletePost.mutate({ id });
      },
    });
  };



  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>
            <Link 
              href="/posts/create"
              className="btn-gradient inline-flex items-center gap-2 hover-glow"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <DashboardPostSkeleton key={i} />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="card-modern p-6 hover-lift animate-in">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          post.published 
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300" 
                            : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-300"
                        }`}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      
                      {/* Categories */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.categories.map((category, index) => (
                            <span
                              key={category.id}
                              className={`text-xs px-2 py-1 rounded ${
                                index % 3 === 0
                                  ? "bg-purple-100 text-purple-700"
                                  : index % 3 === 1
                                    ? "bg-pink-100 text-pink-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By {post.author}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="View Post"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/edit/${post.id}`}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletePost.isPending}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Post"
                      >
                        {deletePost.isPending ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first blog post to get started.
              </p>
              <Link 
                href="/posts/create"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Confirmation Dialog */}
      {ConfirmationDialog}
    </>
  );
}