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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Postly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and share your stories with Postly - a powerful, 
            type-safe blogging platform built with modern web technologies.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/posts/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Start Writing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg"
            >
              View Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to blog
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with Next.js 15, TypeScript, and modern tools for the best developer and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rich Content Editor
              </h3>
              <p className="text-gray-600">
                Write and format your posts with our intuitive editor. 
                Support for markdown and rich text formatting.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-User Support
              </h3>
              <p className="text-gray-600">
                Collaborate with multiple authors. Manage posts, categories, 
                and content with role-based permissions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Built with Next.js 15 and modern web technologies. 
                Optimized for performance and SEO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
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