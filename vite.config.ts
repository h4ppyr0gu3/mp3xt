import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import webExtension from "vite-plugin-web-extension";
import path from 'path';

export default defineConfig({
  root: "src",
  // Configure our outputs - nothing special, this is normal vite config
  plugins: [
    solidPlugin(),
    webExtension({
        manifest: path.resolve(__dirname, "manifest.json"),
        assets: "assets",
        webExtConfig: {
          firefox: "firefox-developer-edition",
          startUrl: ["music.youtube.com"],
          browserConsole: true,
          args: ["--devtools"]
        },
        browser: "firefox",
    }),
  ],
  build: {
    minify: 'terser',
    outDir: path.resolve(__dirname, "build/dist"),
    target: 'esnext',
    polyfillDynamicImport: false,
    emptyOutDir: true,
  },
});
