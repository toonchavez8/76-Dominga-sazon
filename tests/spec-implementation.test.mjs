import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
	return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("visible content files no longer contain mojibake sequences", () => {
	const files = [
		"src/components/Hero.astro",
		"src/components/About.astro",
		"src/components/Contact.astro",
		"src/components/Footer.astro",
		"src/components/GoogleReviewsPanel.tsx",
		"src/components/Navbar.astro",
		"src/components/WhatsAppButtonclient.tsx",
		"src/data/menu.json",
		"src/layouts/BaseLayout.astro",
	];

	for (const file of files) {
		const source = read(file);
		assert.equal(source.includes("Ã"), false, `${file} still contains mojibake`);
		assert.equal(source.includes("Â"), false, `${file} still contains mojibake`);
	}
});

test("contact section includes hardened iframe and Google reviews panel", () => {
	const contact = read("src/components/Contact.astro");
	assert.match(contact, /sandbox="allow-scripts allow-same-origin allow-popups"/);
	const page = read("src/pages/index.astro");
	assert.match(page, /<GoogleReviewsPanel/);
});

test("reviews component renders fixed-width carousel cards with fade rails", () => {
	const reviews = read("src/components/GoogleReviewsPanel.tsx");
	assert.match(reviews, /data-review-card/);
	assert.match(reviews, /w-\[18\.5rem\]/);
	assert.match(reviews, /linear-gradient\(90deg/);
});

test("footer no longer exposes placeholder social links", () => {
	const footer = read("src/components/Footer.astro");
	assert.equal(footer.includes('href="#"'), false);
	assert.match(footer, /data-social-links="hidden"/);
});

test("menu data keeps the expected public categories", () => {
	const menuData = JSON.parse(read("src/data/menu.json"));
	assert.deepEqual(Object.keys(menuData.sections), ["alimentos", "bebidas"]);
	assert.equal(menuData.extras.length > 0, true);

	for (const section of Object.values(menuData.sections)) {
		for (const item of section) {
			assert.equal(typeof item.name, "string");
			assert.equal(item.name.length > 0, true);
			assert.equal(typeof item.price, "number");
		}
	}
});
