import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const localizedString = z.object({
  en: z.string(),
  de: z.string().optional(),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog", generateId: ({entry}) => entry }),
  schema: ({ image }) => z.object({
    title: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()),
    cover: z.object({
      src: image(),
      alt: z.string().optional(),
    }).optional(),
  })
});
const galleryCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yml", base: "./src/content/gallery" }),
  schema: ({ image }) => z.object({
    title: localizedString,
    cover: image(),
    images: z.array(
      z.object({
        src: image(),
        title: localizedString.optional(),
        description: localizedString.optional(),
      })
    ),
  }),
});
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    path: z.string(),
  })
});
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: z.object({
      src: image(),
      alt: z.string().optional(),
    }).optional(),
  })
});

export const collections = {
  'blog': blogCollection,
  'gallery': galleryCollection,
  'pages': pagesCollection,
  'projects': projectsCollection,
};
