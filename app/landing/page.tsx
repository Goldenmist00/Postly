"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import BlogCard from "@/components/blog-card";
import { trpc } from "@/src/utils/trpc";
import { PostCardSkeleton } from "@/components/skeletons";

export default function LandingPage() {
  // Fetch published posts from database
  const { data: posts, isLoading, error } = trpc.posts.getAll.useQuery({
    published: true,
  });

  // Debug logging
  console.log("Landing page - Posts data:", posts);
  console.log("Landing page - Is loading:", isLoading);
  console.log("Landing page - Error:", error);

  // Transform posts to match BlogCard interface with error handling
  const transformedPosts = posts?.slice(0, 6).map((post: any) => {
    try {
      return {
        id: post.id,
        title: post.title || "Untitled Post",
        description: (post.content || "").substring(0, 150) + "...",
        author: post.author || "Anonymous",
        date: new Date(post.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        image: post.image || "/placeholder.svg",
        tags: [], // Legacy field, now using categories
        slug: post.slug || `post-${post.id}`,
        content: post.content || "",
        categories: post.categories || [],
      };
    } catch (err) {
      console.error("Error transforming post:", err, post);
      return {
        id: post.id || Math.random(),
        title: "Error loading post",
        description: "There was an error loading this post.",
        author: "System",
        date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        image: "/placeholder.svg",
        tags: [],
        slug: `error-${post.id}`,
        content: "",
        categories: [],
      };
    }
  }) || [];

  console.log("Landing page - Transformed posts:", transformedPosts);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              Postly
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                View Blog
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-in">
            <span className="gradient-text">Welcome to</span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">Postly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed animate-in" style={{animationDelay: '0.2s'}}>
            Create, manage, and share your stories with Postly - a powerful, 
            type-safe blogging platform built with modern web technologies.
            Experience the future of content creation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{animationDelay: '0.4s'}}>
            <Link 
              href="/posts/create"
              className="btn-gradient inline-flex items-center gap-2 text-lg hover-glow animate-bounce-gentle"
            >
              Start Writing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 glass dark:glass-dark text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 text-lg"
            >
              View Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-in">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Everything you need</span>
              <br />
              <span className="text-gray-900 dark:text-gray-100">to blog</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Built with Next.js 15, TypeScript, and modern tools for the best developer and user experience.
              Experience the future of content creation with our cutting-edge platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern text-center p-8 hover-lift animate-in group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Rich Content Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Write and format your posts with our intuitive editor. 
                Support for markdown and rich text formatting.
              </p>
            </div>

            <div className="card-modern text-center p-8 hover-lift animate-in group" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Multi-User Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Collaborate with multiple authors. Manage posts, categories, 
                and content with role-based permissions.
              </p>
            </div>

            <div className="card-modern text-center p-8 hover-lift animate-in group" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Built with Next.js 15 and modern web technologies. 
                Optimized for performance and SEO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ALL BLOG POSTS SECTION - GUARANTEED VISIBLE */}
      <section className="py-20 bg-red-100 border-8 border-red-500">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* ALWAYS VISIBLE HEADER */}
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-red-600 mb-4">
              🔴 ALL BLOG POSTS 🔴
            </h2>
            <p className="text-2xl text-red-800 font-bold">
              THIS SECTION SHOULD ALWAYS BE VISIBLE!
            </p>
            <div className="mt-4 p-4 bg-yellow-200 rounded-lg">
              <p className="text-black font-bold">
                Debug Info: Loading={isLoading ? "YES" : "NO"} | 
                Posts={posts?.length || 0} | 
                Error={error ? "YES" : "NO"}
              </p>
            </div>
          </div>

          {/* SIMPLE CONTENT AREA */}
          <div className="bg-white border-4 border-black p-8 rounded-lg min-h-[500px]">
            
            {/* LOADING STATE */}
            {isLoading && (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600 mb-4">LOADING POSTS...</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold">Loading {i}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-red-600 mb-4">ERROR LOADING POSTS!</h3>
                <p className="text-xl text-red-500 mb-4">{error.message}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-bold"
                >
                  RETRY
                </button>
              </div>
            )}

            {/* SUCCESS STATE */}
            {!isLoading && !error && (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600 mb-4">
                  POSTS LOADED! Found {transformedPosts.length} posts
                </h3>
                
                {transformedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {transformedPosts.map((post, index) => (
                      <div key={post.id || index} className="bg-blue-100 p-6 rounded-lg border-2 border-blue-500">
                        <h4 className="text-xl font-bold text-blue-800 mb-2">{post.title}</h4>
                        <p className="text-blue-600 mb-2">By: {post.author}</p>
                        <p className="text-blue-600 mb-2">Date: {post.date}</p>
                        <p className="text-blue-700">{post.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-100 p-8 rounded-lg border-2 border-yellow-500">
                    <h4 className="text-2xl font-bold text-yellow-800 mb-4">NO POSTS FOUND</h4>
                    <p className="text-yellow-700 mb-4">Create your first blog post!</p>
                    <Link 
                      href="/posts/create"
                      className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-xl font-bold inline-block"
                    >
                      CREATE FIRST POST
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200/50 dark:border-gray-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Postly
              </h3>
              <p className="text-gray-600 mb-4">
                A modern blogging platform built with Next.js 15, TypeScript, 
                tRPC, and Drizzle ORM. Type-safe from database to UI.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Tech Stack</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Next.js 15</li>
                <li>TypeScript</li>
                <li>tRPC</li>
                <li>Drizzle ORM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2025 Postly. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}