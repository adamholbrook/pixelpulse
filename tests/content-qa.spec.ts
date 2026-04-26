/**
 * Content QA gate — runs before every build.
 *
 * Reviews & Coins Well Spent:
 *   - `score` must be present and a number between 1 and 10 (inclusive)
 *   - `verdict` must be present and non-empty
 *   - `originalRelease` must be present and non-empty (Coins Well Spent only)
 *   - `reviewerName` must be present and non-empty
 *
 * Side Quests:
 *   - `author` must be present and non-empty
 *   - `description` must be present and non-empty
 *
 * Add new rules here as your editorial standards evolve.
 */
import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '..');
const REVIEWS_DIR = resolve(ROOT, 'src/content/reviews');
const COINS_DIR = resolve(ROOT, 'src/content/coins-well-spent');
const QUESTS_DIR = resolve(ROOT, 'src/content/side-quests');

function getContentFiles(dir: string): string[] {
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
		if (value && !value.startsWith('-') && !value.startsWith('{')) {
			fields[key] = value.replace(/^["']|["']$/g, '');
		}
	}
	return fields;
}

function rel(filePath: string) {
	return filePath.replace(ROOT + '/', '');
}

// ─── Reviews ────────────────────────────────────────────────────────────────

const reviewFiles = getContentFiles(REVIEWS_DIR);

test('reviews directory contains at least one review', () => {
	expect(reviewFiles.length, 'No review files found in src/content/reviews/').toBeGreaterThan(0);
});

for (const filePath of reviewFiles) {
	const label = rel(filePath);
	const content = readFileSync(filePath, 'utf-8');
	const fm = extractFrontmatter(content);

	test(`[${label}] has a valid score (1–10)`, () => {
		const raw = fm['score'];
		expect(raw, `Missing "score" in ${label}`).toBeTruthy();
		const score = parseFloat(raw);
		expect(isNaN(score), `"score" is not a number in ${label}: "${raw}"`).toBe(false);
		expect(score, `"score" out of range in ${label}`).toBeGreaterThanOrEqual(1);
		expect(score, `"score" out of range in ${label}`).toBeLessThanOrEqual(10);
	});

	test(`[${label}] has a non-empty verdict`, () => {
		const verdict = fm['verdict'];
		expect(verdict, `Missing "verdict" in ${label}`).toBeTruthy();
		expect(verdict.trim().length, `"verdict" is empty in ${label}`).toBeGreaterThan(0);
	});

	test(`[${label}] has a non-empty reviewerName`, () => {
		const name = fm['reviewerName'];
		expect(name, `Missing "reviewerName" in ${label}`).toBeTruthy();
		expect(name.trim().length, `"reviewerName" is empty in ${label}`).toBeGreaterThan(0);
	});
}

// ─── Coins Well Spent ────────────────────────────────────────────────────────

const coinsFiles = getContentFiles(COINS_DIR);

test('coins-well-spent directory contains at least one entry', () => {
	expect(coinsFiles.length, 'No files found in src/content/coins-well-spent/').toBeGreaterThan(0);
});

for (const filePath of coinsFiles) {
	const label = rel(filePath);
	const content = readFileSync(filePath, 'utf-8');
	const fm = extractFrontmatter(content);

	test(`[${label}] has a valid score (1–10)`, () => {
		const raw = fm['score'];
		expect(raw, `Missing "score" in ${label}`).toBeTruthy();
		const score = parseFloat(raw);
		expect(isNaN(score), `"score" is not a number in ${label}: "${raw}"`).toBe(false);
		expect(score, `"score" out of range in ${label}`).toBeGreaterThanOrEqual(1);
		expect(score, `"score" out of range in ${label}`).toBeLessThanOrEqual(10);
	});

	test(`[${label}] has a non-empty verdict`, () => {
		const verdict = fm['verdict'];
		expect(verdict, `Missing "verdict" in ${label}`).toBeTruthy();
		expect(verdict.trim().length, `"verdict" is empty in ${label}`).toBeGreaterThan(0);
	});

	test(`[${label}] has a non-empty originalRelease`, () => {
		const release = fm['originalRelease'];
		expect(release, `Missing "originalRelease" in ${label}`).toBeTruthy();
		expect(release.trim().length, `"originalRelease" is empty in ${label}`).toBeGreaterThan(0);
	});

	test(`[${label}] has a non-empty reviewerName`, () => {
		const name = fm['reviewerName'];
		expect(name, `Missing "reviewerName" in ${label}`).toBeTruthy();
		expect(name.trim().length, `"reviewerName" is empty in ${label}`).toBeGreaterThan(0);
	});
}

// ─── Side Quests ─────────────────────────────────────────────────────────────

const questFiles = getContentFiles(QUESTS_DIR);

test('side-quests directory contains at least one story', () => {
	expect(questFiles.length, 'No files found in src/content/side-quests/').toBeGreaterThan(0);
});

for (const filePath of questFiles) {
	const label = rel(filePath);
	const content = readFileSync(filePath, 'utf-8');
	const fm = extractFrontmatter(content);

	test(`[${label}] has a non-empty author`, () => {
		const author = fm['author'];
		expect(author, `Missing "author" in ${label}`).toBeTruthy();
		expect(author.trim().length, `"author" is empty in ${label}`).toBeGreaterThan(0);
	});

	test(`[${label}] has a non-empty description`, () => {
		const description = fm['description'];
		expect(description, `Missing "description" in ${label}`).toBeTruthy();
		expect(description.trim().length, `"description" is empty in ${label}`).toBeGreaterThan(0);
	});

	test(`[${label}] body contains actual content beyond frontmatter`, () => {
		const body = content.replace(/^---[\s\S]*?---/, '').trim();
		expect(body.length, `Story body is empty in ${label}`).toBeGreaterThan(50);
	});
}
