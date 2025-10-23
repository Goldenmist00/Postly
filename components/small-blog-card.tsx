import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Post {
  id: number
  title: string
  description: string
  author: string
  date: string
  image: string
  tags: string[]
  slug?: string
  categories?: Array<{
    id: number
    name: string
    slug: string
  }>
}

export default function SmallBlogCard({ post }: { post: Post }) {
  const href = `/posts/${post.slug || post.id}`;
  
  return (
    <Link href={href} className="group cursor-pointer flex gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
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

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-xs text-primary font-medium">{post.author}</p>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
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
      </div>
    </Link>
  )
}
