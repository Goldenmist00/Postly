"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/src/utils/trpc";
import BlogCard from "@/components/blog-card";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const { data, isLoading, error } = trpc.posts.getByCategorySlug.useQuery({ 
    categorySlug,
    published: true 
  });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
              <p className="text-gray-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const { category, posts } = data;

  // Transform posts for component interface
  const transformedPosts = posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    description: post.content.substring(0, 150) + "...",
    author: post.author || "Anonymous",
    date: new Date(post.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    image: post.image || "/placeholder.svg",
    tags: [],
    slug: post.slug,
    categories: post.categories || [],
  }));

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Back button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-gray-600 max-w-2xl">{category.description}</p>
            )}
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
              </span>
            </div>
          </div>

          {/* Posts Grid */}
          {transformedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedPosts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts in this category yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a post in the &quot;{category.name}&quot; category.
              </p>
              <Link 
                href="/posts/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}