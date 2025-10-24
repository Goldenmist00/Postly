import { ArrowRight, Clock, ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { calculateReadingTime, formatReadingTime } from "@/lib/post-utils"
import { isValidImageUrl } from "@/lib/image-utils"

interface Post {
  id: number
  title: string
  description: string
  author: string
  date: string
  image: string
  tags: string[]
  slug?: string
  content?: string
  categories?: Array<{
    id: number
    name: string
    slug: string
  }>
}

export default function BlogCard({ post }: { post: Post }) {
  const href = `/posts/${post.slug || post.id}`;
  
  return (
    <div className="card-modern hover-lift animate-in group cursor-pointer">
      <Link href={href} className="block">
        <div className="relative h-48 rounded-t-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {isValidImageUrl(post.image) ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No image</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">{post.author}</p>
          <p className="text-xs text-muted-foreground">{post.date}</p>
          {post.content && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
            </div>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:gradient-text transition-all duration-200 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.categories && post.categories.length > 0 ? (
              post.categories.map((category, index) => (
                <span
                  key={category.id}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    index % 3 === 0
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-300"
                      : index % 3 === 1
                        ? "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 dark:from-pink-900/30 dark:to-pink-800/30 dark:text-pink-300"
                        : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300"
                  }`}
                >
                  {category.name}
                </span>
              ))
            ) : (
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 dark:from-gray-800/30 dark:to-gray-700/30 dark:text-gray-400">
                Uncategorized
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
