import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { localeSlugs, type Locale } from './configuration';
import { localizedSchema } from 'astro-loader-i18n';

const l = localizedSchema()

const localized = <T extends z.ZodTypeAny>(schema: T) =>
  z.object(
    localeSlugs.reduce(
      (acc, key) => {
        acc[key] = schema;
        return acc;
      },
      {} as Record<Locale, T>,
    ),
  );

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
    title: localized(z.string()),
    cover: image(),
    images: z.array(
      z.object({
        src: image(),
        title: localized(z.string().optional()).optional(),
        description: localized(z.string().optional()).optional(),
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
const navigationCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yml", base: "./src/content/navigation" }),
  schema: ({ image }) =>
    localized(
      z.array(
        z.object({
          title: z.string(),
          path: z.string().url().or(z.string()),
          icon: image().optional(),
        }),
      ),
    ),
});
const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/sections" }),
  schema: z.object({}),
})

export const collections = {
  blog: blogCollection,
  gallery: galleryCollection,
  pages: pagesCollection,
  projects: projectsCollection,
  navigation: navigationCollection,
  sections: sectionsCollection,
};
