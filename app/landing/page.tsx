import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export default function LandingPage() {
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

      {/* All Blog Posts Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-in">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gray-900 dark:text-gray-100">All blog posts</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover the latest stories, insights, and ideas from our community of writers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Sample Blog Post 1 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group">
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Alex Whitten</span>
                    <span>•</span>
                    <span>17 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  Bill Walsh leadership lessons
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Leadership
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Management
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Blog Post 2 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group" style={{animationDelay: '0.1s'}}>
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Demi Wilkinson</span>
                    <span>•</span>
                    <span>16 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  PM mental models
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  Mental models are simple expressions of complex processes or relationships.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Product
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                    Research
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    Frameworks
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Blog Post 3 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group" style={{animationDelay: '0.2s'}}>
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Candice Wu</span>
                    <span>•</span>
                    <span>15 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  What is wireframing?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  Introduction to Wireframing and its Principles. Learn from the best in the industry.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Design
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Research
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Blog Post 4 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group" style={{animationDelay: '0.3s'}}>
              <div className="relative h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Natali Craig</span>
                    <span>•</span>
                    <span>14 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  How collaboration makes us better designers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  Collaboration can make our teams stronger, and our individual designs better.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Design
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Research
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Blog Post 5 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group" style={{animationDelay: '0.4s'}}>
              <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Drew Cano</span>
                    <span>•</span>
                    <span>13 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  Our top 10 Javascript frameworks to use
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  JavaScript frameworks make development easy with extensive features and functionalities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    Software
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Tools
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                    SaaS
                  </span>
                </div>
              </div>
            </div>

            {/* Sample Blog Post 6 */}
            <div className="card-modern overflow-hidden hover-lift animate-in group" style={{animationDelay: '0.5s'}}>
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Orlando Diggs</span>
                    <span>•</span>
                    <span>12 Jan 2025</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:gradient-text transition-all duration-200">
                  Podcast: Creating a better CX Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  Starting a community doesn&apos;t need to be complicated, but how do you get started?
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                    Podcasts
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Customer Success
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              ← Previous
            </button>
            
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium bg-blue-600 text-white">
                1
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                3
              </button>
              <span className="text-gray-400 px-2">...</span>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                8
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                9
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                10
              </button>
            </div>

            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Next →
            </button>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link 
              href="/"
              className="btn-gradient inline-flex items-center gap-2 hover-glow"
            >
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
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