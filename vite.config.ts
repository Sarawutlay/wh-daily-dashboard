import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base: "./"` makes all built asset URLs relative, so the app works
// correctly both at the domain root and under a GitHub Pages project
// subpath (e.g. https://username.github.io/repo-name/) without needing
// to hardcode the repository name here.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
