import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const build = new URL("dist/", root);
const html = await readFile(new URL("index.html", build), "utf8");

if (/src=["'][^"']*\/src\//.test(html) || !/assets\/[^"']+\.js/.test(html)) {
  throw new Error("Pages must publish compiled JavaScript, not the development entrypoint.");
}

// Pages currently publishes main / (root). Copy the compiled assets first,
// then replace its HTML entrypoint. Keep editable HTML in client/index.html.
await mkdir(new URL("assets/", root), { recursive: true });
await cp(new URL("assets/", build), new URL("assets/", root), { recursive: true });
await writeFile(new URL(".nojekyll", root), "");
await writeFile(new URL("index.html", root), html);
console.log(`Prepared GitHub Pages in ${fileURLToPath(root)}`);
