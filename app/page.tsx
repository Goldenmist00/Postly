"use client";

import { useState, useMemo } from "react"
import { ChevronRight, ChevronLeft, Search } from "lucide-react"
import BlogCard from "@/components/blog-card"
import FeaturedBlogCard from "@/components/featured-blog-card"
import SmallBlogCard from "@/components/small-blog-card"
import Navigation from "@/components/navigation"
import { PostCardSkeleton, FeaturedPostSkeleton, SmallPostSkeleton } from "@/components/skeletons"
import { trpc } from "@/src/utils/trpc"
import { useUIStore } from "@/src/store"

export default function BlogPage() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useUIStore();
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Fetch all posts once and filter client-side for better performance
  const { data: allPosts, isLoading } = trpc.posts.getAll.useQuery({
    published: true,
  });
  const { data: categories } = trpc.categories.getAll.useQuery();

  // Filter posts client-side based on selected category and search query
  const filteredPosts = useMemo(() => {
    if (!allPosts) return [];
    
    let filtered = allPosts;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => 
        post.categories?.some(cat => cat.slug === selectedCategory)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author?.toLowerCase().includes(query) ||
        post.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [allPosts, selectedCategory, searchQuery]);

  const handleCategoryChange = (categorySlug: string) => {
    setIsFiltering(true);
    setSelectedCategory(categorySlug);
    // Small delay to show filtering state, then remove it
    setTimeout(() => setIsFiltering(false), 100);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
            {/* Search and Filter Skeleton */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              </div>
            </div>

            {/* Recent blog posts skeleton */}
            <section className="mb-16">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured large post skeleton */}
                <div className="lg:col-span-1">
                  <FeaturedPostSkeleton />
                </div>

                {/* Small featured posts skeleton */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <SmallPostSkeleton />
                  <SmallPostSkeleton />
                </div>
              </div>
            </section>

            {/* All blog posts skeleton */}
            <section>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </>
    )
  }

  // Transform filtered posts to match component interface
  const transformedPosts = filteredPosts?.map((post: any) => ({
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
    tags: [], // Legacy field, now using categories
    slug: post.slug,
    content: post.content, // Add full content for reading time calculation
    categories: post.categories || [],
  })) || []

  const featuredPosts = transformedPosts.slice(0, 1)
  const smallFeaturedPosts = transformedPosts.slice(1, 3)
  const remainingPosts = transformedPosts.slice(3)

  return (
    <>
      <Navigation />
      <main className="page-bg">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, authors, or categories..."
                className="input-modern w-full pl-12"
              />
            </div>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="category-select" className="text-lg font-semibold text-primary">
                  Filter by Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="input-modern min-w-[200px]"
                  disabled={isLoading}
                >
                  <option value="all">All Posts ({allPosts?.length || 0})</option>
                  {categories.map((category) => {
                    const categoryPostCount = allPosts?.filter(post => 
                      post.categories?.some(cat => cat.slug === category.slug)
                    ).length || 0;
                    return (
                      <option key={category.id} value={category.slug}>
                        {category.name} ({categoryPostCount})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Results Count */}
            {(searchQuery.trim() || selectedCategory !== "all") && (
              <div className="text-sm text-muted">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                {searchQuery.trim() && ` for "${searchQuery}"`}
                {selectedCategory !== "all" && ` in ${categories?.find(c => c.slug === selectedCategory)?.name}`}
              </div>
            )}
          </div>

          {/* Recent blog posts section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-8">
              {isFiltering ? (
                <span className="opacity-50">Filtering...</span>
              ) : selectedCategory === "all" ? (
                "Recent blog posts" 
              ) : (
                `${categories?.find(c => c.slug === selectedCategory)?.name || "Category"} Posts`
              )}
            </h2>

            {transformedPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Featured large post */}
                <div className="lg:col-span-1 order-1 lg:order-1">
                  {featuredPosts.map((post: any) => (
                    <FeaturedBlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Small featured posts */}
                <div className="lg:col-span-2 order-2 lg:order-2 flex flex-col gap-4 md:gap-6">
                  {smallFeaturedPosts.map((post: any) => (
                    <SmallBlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted">No blog posts found. Create your first post!</p>
              </div>
            )}
          </section>

          {/* All blog posts section */}
          {remainingPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-8">All blog posts</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {remainingPosts.map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium btn-primary">
                    1
                  </button>
                  {[2, 3, 4, 5, 6, 8, 10].map((page) => (
                    <button
                      key={page}
                      className="w-8 h-8 rounded flex items-center justify-center text-sm text-muted hover:text-primary transition-colors"
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}