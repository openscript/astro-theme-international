import { defineCollection, z, type ImageFunction } from 'astro:content';
import { C } from '../configuration';

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
const createGalleryCollection = (image: ImageFunction) => z.object({
  title: z.string(),
  cover: image(),
  images: z.array(
    z.object({
      src: image().refine((img) => img.width >= 800, {
        message: "Image must be at least 800 pixels wide!",
      }),
      alt: z.string().optional(),
    })
  ),
}).optional();

const galleryCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({...Object.keys(C.LOCALES).reduce<Record<string, ReturnType<typeof createGalleryCollection>>>((acc, locale) => ({...acc, [locale]: createGalleryCollection(image)}), {})}),
});
const pagesCollection = defineCollection({
  schema: z.object({
    path: z.string()
  })
});

export const collections = {
  'blog': blogCollection,
  'gallery': galleryCollection,
  'pages': pagesCollection
};
