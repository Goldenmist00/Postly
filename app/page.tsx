"use client";

import { useState, useMemo } from "react"
import { ChevronRight, ChevronLeft, Search } from "lucide-react"
import BlogCard from "@/components/blog-card"
import FeaturedBlogCard from "@/components/featured-blog-card"
import SmallBlogCard from "@/components/small-blog-card"
import Navigation from "@/components/navigation"
import { trpc } from "@/src/utils/trpc"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  
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
        <main className="min-h-screen bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-muted rounded-lg"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Transform filtered posts to match component interface
  const transformedPosts = filteredPosts?.map(post => ({
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
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, authors, or categories..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="category-select" className="text-lg font-semibold text-gray-900">
                  Filter by Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 min-w-[200px] transition-all duration-200"
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
              <div className="text-sm text-gray-600">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                {searchQuery.trim() && ` for "${searchQuery}"`}
                {selectedCategory !== "all" && ` in ${categories?.find(c => c.slug === selectedCategory)?.name}`}
              </div>
            )}
          </div>

          {/* Recent blog posts section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {isFiltering ? (
                <span className="opacity-50">Filtering...</span>
              ) : selectedCategory === "all" ? (
                "Recent blog posts" 
              ) : (
                `${categories?.find(c => c.slug === selectedCategory)?.name || "Category"} Posts`
              )}
            </h2>

            {transformedPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured large post */}
                <div className="lg:col-span-1">
                  {featuredPosts.map((post) => (
                    <FeaturedBlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Small featured posts */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {smallFeaturedPosts.map((post) => (
                    <SmallBlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts found. Create your first post!</p>
              </div>
            )}
          </section>

          {/* All blog posts section */}
          {remainingPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-8">All blog posts</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {remainingPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground">
                    1
                  </button>
                  {[2, 3, 4, 5, 6, 8, 10].map((page) => (
                    <button
                      key={page}
                      className="w-8 h-8 rounded flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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