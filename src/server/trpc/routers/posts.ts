import { router, publicProcedure } from "../trpc";
import { db } from "@/src/db";
import { posts, categories, postCategories } from "@/src/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { 
  createPostSchema, 
  updatePostSchema, 
  getPostBySlugSchema, 
  getPostByIdSchema, 
  deletePostSchema,
  getPostsSchema,
  getCategoryPostsSchema 
} from "@/src/utils/validation";
import { 
  handleTRPCError, 
  AppNotFoundError, 
  AppDatabaseError,
  withRetry 
} from "@/src/utils/error-handling";
import { SUCCESS_MESSAGES } from "@/src/constants";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const postsRouter = router({
  getAll: publicProcedure
    .input(getPostsSchema)
    .query(async ({ input }) => {
      try {
        return await withRetry(async () => {
          // Build where conditions
          const conditions = [];
          
          if (input.published !== undefined) {
            conditions.push(eq(posts.published, input.published));
          }

          if (input.search) {
            conditions.push(
              or(
                like(posts.title, `%${input.search}%`),
                like(posts.content, `%${input.search}%`),
                like(posts.author, `%${input.search}%`)
              )
            );
          }

          const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

          const postsData = await db
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
            .where(whereClause)
            .orderBy(desc(posts.createdAt))
            .limit(input.limit)
            .offset((input.page - 1) * input.limit);

          // Get categories for each post
          const postsWithCategories = await Promise.all(
            postsData.map(async (post) => {
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
          if (input.categorySlug) {
            return postsWithCategories.filter(post => 
              post.categories.some(cat => cat.slug === input.categorySlug)
            );
          }

          return postsWithCategories;
        });
      } catch (error) {
        console.error('Database error in getAll posts:', error);
        // Fallback data for development
        return [{ 
          id: 1, 
          title: "Welcome to Postly", 
          content: "This is your first blog post. The database connection will be established soon!", 
          slug: "welcome-to-postly",
          author: "System",
          image: null,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: []
        }];
      }
    }),

  getBySlug: publicProcedure
    .input(getPostBySlugSchema)
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
    .input(getPostByIdSchema)
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
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        return await withRetry(async () => {
          const slug = generateSlug(input.title);
          
          // Check if slug already exists
          const existingPost = await db
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1);

          const finalSlug = existingPost.length > 0 
            ? `${slug}-${Date.now()}` 
            : slug;

          const [newPost] = await db.insert(posts).values({
            title: input.title,
            content: input.content,
            slug: finalSlug,
            author: input.author || "Anonymous",
            image: input.image || null,
            published: input.published || false,
          }).returning();

          if (!newPost) {
            throw new AppDatabaseError('Failed to create post');
          }

          // Add categories if provided
          if (input.categoryIds && input.categoryIds.length > 0) {
            const categoryInserts = input.categoryIds.map(categoryId => ({
              postId: newPost.id,
              categoryId,
            }));
            await db.insert(postCategories).values(categoryInserts);
          }

          return newPost;
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // Fallback for development
          console.log("Database not available, returning mock post");
          const slug = generateSlug(input.title);
          return {
            id: Math.floor(Math.random() * 1000),
            title: input.title,
            content: input.content,
            slug,
            author: input.author || "Anonymous",
            image: input.image || null,
            published: input.published || false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        throw handleTRPCError(error);
      }
    }),

  update: publicProcedure
    .input(updatePostSchema)
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
    .input(deletePostSchema)
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
    .input(getCategoryPostsSchema)
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