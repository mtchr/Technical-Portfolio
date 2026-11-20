import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
assert.equal(html, await readFile(new URL("dist/index.html", root), "utf8"));
assert(!/src=["'][^"']*\/src\//.test(html), "Published HTML must not load development source");
assert(/src="\.\/assets\/[^"']+\.js"/.test(html), "Published HTML must load a relative compiled bundle");
assert(/href="\.\/assets\/[^"']+\.css"/.test(html), "Published HTML must load compiled styles");
await access(new URL(".nojekyll", root));
for (const entry of await readdir(new URL("dist/assets/", root))) {
  const built = await readFile(new URL(`dist/assets/${entry}`, root));
  const published = await readFile(new URL(`assets/${entry}`, root));
  assert(built.equals(published), `Published asset differs from build: ${entry}`);
}
assert((await readFile(new URL("client/index.html", root), "utf8")).includes("../src/main.js"));
console.log("PASS: Pages serves the built HTML, relative JS/CSS bundles, all matching assets, and .nojekyll; editable source is preserved.");
