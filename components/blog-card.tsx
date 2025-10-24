import { ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { calculateReadingTime, formatReadingTime } from "@/lib/post-utils"

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
    <Link href={href} className="group cursor-pointer block">
      <div className="relative h-48 rounded-lg overflow-hidden mb-4 bg-gray-100">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>

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

      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.description}</p>

      <div className="flex flex-wrap gap-2">
        {post.categories && post.categories.length > 0 ? (
          post.categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={`text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity ${
                index % 3 === 0
                  ? "bg-purple-100 text-purple-700"
                  : index % 3 === 1
                    ? "bg-pink-100 text-pink-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {category.name}
            </Link>
          ))
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
            Uncategorized
          </span>
        )}
      </div>
    </Link>
  )
}
