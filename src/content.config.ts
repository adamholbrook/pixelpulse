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

const coinsWellSpent = defineCollection({
	loader: glob({ base: './src/content/coins-well-spent', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			originalRelease: z.string(),
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

const sideQuests = defineCollection({
	loader: glob({ base: './src/content/side-quests', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			author: z.string(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
		}),
});

export const collections = { blog, reviews, coinsWellSpent, sideQuests };
