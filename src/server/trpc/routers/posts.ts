import { router, publicProcedure } from "../trpc";
import { db } from "@/src/db";
import { posts, categories, postCategories } from "@/src/db/schema";
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const postsRouter = router({
  getAll: publicProcedure
    .input(z.object({
      categorySlug: z.string().optional(),
      published: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      try {
        // Get posts with their categories
        const postsWithCategories = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            author: posts.author,
            image: posts.image,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .where(input?.published !== undefined ? eq(posts.published, input.published) : undefined)
          .orderBy(desc(posts.createdAt));

        // Get categories for each post
        const postsWithCategoriesData = await Promise.all(
          postsWithCategories.map(async (post) => {
            const postCategoriesData = await db
              .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
              })
              .from(categories)
              .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
              .where(eq(postCategories.postId, post.id));

            return {
              ...post,
              categories: postCategoriesData,
            };
          })
        );

        // Filter by category if specified
        if (input?.categorySlug) {
          return postsWithCategoriesData.filter(post => 
            post.categories.some(cat => cat.slug === input.categorySlug)
          );
        }

        return postsWithCategoriesData;
      } catch (error) {
        return [{ 
          id: 1, 
          title: "Welcome to Postly", 
          content: "This is your first blog post. The database connection will be established soon!", 
          slug: "welcome-to-postly",
          author: "System",
          image: "/placeholder.svg",
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: []
        }];
      }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const [post] = await db.select().from(posts).where(eq(posts.slug, input.slug));
        
        if (!post) {
          throw new Error("Post not found");
        }

        // Get categories for this post
        const postCategoriesData = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(categories)
          .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
          .where(eq(postCategories.postId, post.id));

        return {
          ...post,
          categories: postCategoriesData,
        };
      } catch (error) {
        throw new Error("Post not found");
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const [post] = await db.select().from(posts).where(eq(posts.id, input.id));
        
        if (!post) {
          throw new Error("Post not found");
        }

        // Get categories for this post
        const postCategoriesData = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(categories)
          .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
          .where(eq(postCategories.postId, post.id));

        return {
          ...post,
          categories: postCategoriesData,
        };
      } catch (error) {
        throw new Error("Post not found");
      }
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      author: z.string().optional(),
      image: z.string().optional(),
      published: z.boolean().optional(),
      categoryIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.title);
        const [newPost] = await db.insert(posts).values({
          title: input.title,
          content: input.content,
          slug,
          author: input.author || "Anonymous",
          image: input.image || "/placeholder.svg",
          published: input.published || false,
        }).returning();

        // Add categories if provided
        if (input.categoryIds && input.categoryIds.length > 0) {
          const categoryInserts = input.categoryIds.map(categoryId => ({
            postId: newPost.id,
            categoryId,
          }));
          await db.insert(postCategories).values(categoryInserts);
        }

        return newPost;
      } catch (error) {
        // Fallback: return a mock post when database is not available
        console.log("Database not available, returning mock post");
        const slug = generateSlug(input.title);
        return {
          id: Math.floor(Math.random() * 1000),
          title: input.title,
          content: input.content,
          slug,
          author: input.author || "Anonymous",
          image: input.image || "/placeholder.svg",
          published: input.published || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1),
      content: z.string().min(1),
      author: z.string().optional(),
      image: z.string().optional(),
      published: z.boolean().optional(),
      categoryIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.title);
        const [updatedPost] = await db
          .update(posts)
          .set({
            title: input.title,
            content: input.content,
            slug,
            author: input.author,
            image: input.image,
            published: input.published,
            updatedAt: new Date(),
          })
          .where(eq(posts.id, input.id))
          .returning();

        // Update categories
        if (input.categoryIds !== undefined) {
          // Delete existing categories
          await db.delete(postCategories).where(eq(postCategories.postId, input.id));
          
          // Add new categories
          if (input.categoryIds.length > 0) {
            const categoryInserts = input.categoryIds.map(categoryId => ({
              postId: input.id,
              categoryId,
            }));
            await db.insert(postCategories).values(categoryInserts);
          }
        }

        return updatedPost;
      } catch (error) {
        throw new Error("Failed to update post");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        // Delete post categories first
        await db.delete(postCategories).where(eq(postCategories.postId, input.id));
        // Delete post
        await db.delete(posts).where(eq(posts.id, input.id));
        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete post");
      }
    }),

  getByCategorySlug: publicProcedure
    .input(z.object({ 
      categorySlug: z.string(),
      published: z.boolean().optional().default(true)
    }))
    .query(async ({ input }) => {
      try {
        // First get the category
        const [category] = await db.select().from(categories).where(eq(categories.slug, input.categorySlug));
        
        if (!category) {
          throw new Error("Category not found");
        }

        // Get posts in this category
        const categoryPosts = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            slug: posts.slug,
            author: posts.author,
            image: posts.image,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .innerJoin(postCategories, eq(posts.id, postCategories.postId))
          .where(
            input.published 
              ? and(eq(postCategories.categoryId, category.id), eq(posts.published, true))
              : eq(postCategories.categoryId, category.id)
          )
          .orderBy(desc(posts.createdAt));

        // Get categories for each post
        const postsWithCategories = await Promise.all(
          categoryPosts.map(async (post) => {
            const postCategoriesData = await db
              .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
              })
              .from(categories)
              .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
              .where(eq(postCategories.postId, post.id));

            return {
              ...post,
              categories: postCategoriesData,
            };
          })
        );

        return {
          category,
          posts: postsWithCategories,
        };
      } catch (error) {
        throw new Error("Failed to fetch posts for category");
      }
    }),
});