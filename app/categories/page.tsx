"use client";

import { useState } from "react";
import { trpc } from "@/src/utils/trpc";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/toast";
import { useConfirmation } from "@/components/confirmation-modal";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { toasts, removeToast, success, error: showError } = useToast();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const { data: categories, isLoading, refetch } = trpc.categories.getAll.useQuery();
  
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: (data) => {
      success("Category created", `"${data.name}" has been created successfully.`);
      refetch();
      setIsCreating(false);
      setName("");
      setDescription("");
    },
    onError: (error) => {
      showError("Failed to create category", error.message);
    },
  });

  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: (data) => {
      success("Category updated", `"${data.name}" has been updated successfully.`);
      refetch();
      setEditingId(null);
      setName("");
      setDescription("");
    },
    onError: (error) => {
      showError("Failed to update category", error.message);
    },
  });

  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => {
      success("Category deleted", "Category has been permanently deleted.");
      refetch();
    },
    onError: (error) => {
      showError("Failed to delete category", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Missing required field", "Category name is required");
      return;
    }

    if (editingId) {
      updateCategory.mutate({
        id: editingId,
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } else {
      createCategory.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    }
  };

  const startEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleDelete = (id: number, categoryName: string) => {
    confirm({
      title: "Delete Category",
      message: `Are you sure you want to delete "${categoryName}"? This will remove the category from all associated posts. This action cannot be undone.`,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        deleteCategory.mutate({ id });
      },
    });
  };

  return (
    <>
      <Navigation />
      <main className="page-bg">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Manage your blog categories</p>
            </div>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="btn-gradient inline-flex items-center gap-2 hover-glow"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? "Edit Category" : "Create New Category"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createCategory.isPending || updateCategory.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createCategory.isPending || updateCategory.isPending 
                      ? (editingId ? "Updating..." : "Creating...") 
                      : (editingId ? "Update" : "Create")
                    }
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={deleteCategory.isPending}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Category"
                      >
                        {deleteCategory.isPending ? (
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
                No categories yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first category to organize your blog posts.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Category
              </button>
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