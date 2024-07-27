import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    publishedAt: z.date(),
    cover: z.object({
      src: image().refine((img) => img.width >= 800, {
        message: "Cover image must be at least 800 pixels wide!",
      }),
      alt: z.string().optional(),
    }).optional(),
  })
});
const pagesCollection = defineCollection({
  schema: z.object({
    path: z.string()
  })
});

export const collections = {
  'blog': blogCollection,
  'pages': pagesCollection
};
