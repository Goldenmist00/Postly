import { router, publicProcedure } from "../trpc";
import { db } from "@/src/db";
import { categories } from "@/src/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const allCategories = await db.select().from(categories);
      return allCategories;
    } catch (error) {
      return [
        { id: 1, name: "Design", description: "Design related posts", slug: "design", createdAt: new Date() },
        { id: 2, name: "Research", description: "Research articles", slug: "research", createdAt: new Date() },
        { id: 3, name: "Software", description: "Software development", slug: "software", createdAt: new Date() },
      ];
    }
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.name);
        const [newCategory] = await db.insert(categories).values({
          name: input.name,
          description: input.description || "",
          slug,
        }).returning();
        return newCategory;
      } catch (error) {
        throw new Error("Failed to create category");
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.name);
        const [updatedCategory] = await db
          .update(categories)
          .set({
            name: input.name,
            description: input.description,
            slug,
          })
          .where(eq(categories.id, input.id))
          .returning();
        return updatedCategory;
      } catch (error) {
        throw new Error("Failed to update category");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(categories).where(eq(categories.id, input.id));
        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete category");
      }
    }),
});