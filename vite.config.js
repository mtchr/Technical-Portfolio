import { defineConfig } from "vite";

export default defineConfig({
  root: "client",
  base: "./",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
