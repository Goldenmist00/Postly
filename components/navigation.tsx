"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200">
              Postly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm text-secondary hover:text-primary transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm text-secondary hover:text-primary transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/categories" 
                className="text-sm text-secondary hover:text-primary transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Categories
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/posts/create"
              className="btn-gradient flex items-center gap-2 hover-glow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Create Post</span>
              <span className="lg:hidden">Create</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/categories" 
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/posts/create"
                className="block w-full mt-4 btn-gradient text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Post
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}