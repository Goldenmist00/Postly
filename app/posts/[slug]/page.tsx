"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/src/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { calculateReadingTime, formatReadingTime } from "@/lib/post-utils";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: post, isLoading, error } = trpc.posts.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-8"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {post && (
        <Head>
          <title>{post.title} | Postly</title>
          <meta name="description" content={post.content.substring(0, 160)} />
          <meta name="author" content={post.author || "Anonymous"} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.content.substring(0, 160)} />
          <meta property="og:type" content="article" />
          {post.image && <meta property="og:image" content={post.image} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.content.substring(0, 160)} />
          {post.image && <meta name="twitter:image" content={post.image} />}
        </Head>
      )}
      <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.image && post.image !== "/placeholder.svg" && (
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Post content */}
        <article className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={`text-sm px-3 py-1 rounded-full hover:opacity-80 transition-opacity ${
                    index % 3 === 0
                      ? "bg-purple-100 text-purple-700"
                      : index % 3 === 1
                        ? "bg-pink-100 text-pink-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Post footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {new Date(post.updatedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${
                post.published 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {post.published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  );
}