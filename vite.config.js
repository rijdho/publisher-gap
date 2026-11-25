import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages and Cloudflare Pages send no Content-Security-Policy for a static site, so the built page
// carries one as a meta element. Only the build gets it: the development server injects inline
// scripts and styles, which this policy refuses. The page reads its data files from its own origin
// and nothing else. Clickjacking stays uncovered: `frame-ancestors` only works as a response header.
const CSP = [
  "default-src 'none'", "script-src 'self'", "style-src 'self'", "font-src 'self'", "img-src 'self' data:",
  "connect-src 'self'", "form-action 'none'", "base-uri 'none'", "object-src 'none'",
].join("; ");
const csp = () => ({
  name: "csp-meta",
  apply: "build",
  transformIndexHtml: (html) => html.replace("<title>", `<meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <title>`),
});

export default defineConfig({
  plugins: [react(), csp()],
  base: "./",
  build: {
    minify: "terser",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true, passes: 3 },
      mangle: { toplevel: true, properties: { regex: /^_/ } },
      format: { comments: false },
    },
  },
});
