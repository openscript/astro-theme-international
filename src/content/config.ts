import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
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
