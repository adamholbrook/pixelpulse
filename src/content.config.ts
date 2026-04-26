import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const reviews = defineCollection({
	loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			platform: z.string(),
			genre: z.string(),
			score: z.number().min(1).max(10),
			pros: z.array(z.string()),
			cons: z.array(z.string()),
			verdict: z.string(),
			reviewerName: z.string(),
			heroImage: z.optional(image()),
			featured: z.boolean().default(false),
		}),
});

export const collections = { blog, reviews };
