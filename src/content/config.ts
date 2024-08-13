import { defineCollection, z } from 'astro:content';

const localizedString = z.object({
  en: z.string(),
  de: z.string().optional(),
});

const blogCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()),
    cover: z.object({
      src: image().refine((img) => img.width >= 800, {
        message: "Cover image must be at least 800 pixels wide!",
      }),
      alt: z.string().optional(),
    }).optional(),
  })
});
const galleryCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    title: localizedString,
    cover: image(),
    images: z.array(
      z.object({
        src: image().refine((img) => img.width >= 800, {
          message: "Image must be at least 800 pixels wide!",
        }),
        title: localizedString.optional(),
        description: localizedString.optional(),
      })
    ),
  }),
});
const pagesCollection = defineCollection({
  schema: z.object({
    path: z.string(),
    section: z.string().optional(),
  })
});
const projectsCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: z.object({
      src: image().refine((img) => img.width >= 800, {
        message: "Cover image must be at least 800 pixels wide!",
      }),
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
