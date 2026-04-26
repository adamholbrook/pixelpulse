/**
 * Content QA gate — runs before every build.
 *
 * Rules for every file in src/content/reviews/:
 *   - `score` must be present and a number between 1 and 10 (inclusive)
 *   - `verdict` must be present and non-empty
 *
 * Add new rules here as your editorial standards evolve.
 */
import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REVIEWS_DIR = resolve(__dirname, '../src/content/reviews');

function getReviewFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isFile() && /\.(md|mdx)$/.test(d.name))
		.map((d) => join(dir, d.name));
}

function extractFrontmatter(content: string): Record<string, string> {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};

	const fields: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const colonIdx = line.indexOf(':');
		if (colonIdx < 1) continue;
		const key = line.slice(0, colonIdx).trim();
		const value = line.slice(colonIdx + 1).trim();
		// Only capture simple scalar values (skip array/object lines)
		if (value && !value.startsWith('-') && !value.startsWith('{')) {
			fields[key] = value.replace(/^["']|["']$/g, '');
		}
	}
	return fields;
}

const reviewFiles = getReviewFiles(REVIEWS_DIR);

test('reviews directory contains at least one review', () => {
	expect(reviewFiles.length, 'No review files found in src/content/reviews/').toBeGreaterThan(0);
});

for (const filePath of reviewFiles) {
	const relativePath = filePath.replace(resolve(__dirname, '..') + '/', '');
	const content = readFileSync(filePath, 'utf-8');
	const frontmatter = extractFrontmatter(content);

	test(`[${relativePath}] has a valid score (1–10)`, () => {
		const raw = frontmatter['score'];
		expect(raw, `Missing "score" field in ${relativePath}`).toBeTruthy();

		const score = parseFloat(raw);
		expect(isNaN(score), `"score" is not a number in ${relativePath}: "${raw}"`).toBe(false);
		expect(score, `"score" must be between 1 and 10 in ${relativePath}`).toBeGreaterThanOrEqual(1);
		expect(score, `"score" must be between 1 and 10 in ${relativePath}`).toBeLessThanOrEqual(10);
	});

	test(`[${relativePath}] has a non-empty verdict`, () => {
		const verdict = frontmatter['verdict'];
		expect(verdict, `Missing "verdict" field in ${relativePath}`).toBeTruthy();
		expect(
			verdict.trim().length,
			`"verdict" is empty in ${relativePath}`
		).toBeGreaterThan(0);
	});
}
