import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Navigation() {
  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200">
              Postly
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
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

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/posts/create"
              className="btn-gradient flex items-center gap-2 hover-glow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}