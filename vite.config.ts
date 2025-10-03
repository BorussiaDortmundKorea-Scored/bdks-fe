/// <reference types="vitest/config" />
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: "https://bdks.vercel.app",
      dynamicRoutes: ["/", "/dashboard"],
      exclude: ["/admin/**"],
      outDir: "dist",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date(),
      readable: true,
      generateRobotsTxt: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
  resolve: {
    alias: [
      { find: "@admin", replacement: path.resolve(__dirname, "src/domains/admin") },
      { find: "@animals", replacement: path.resolve(__dirname, "src/domains/animals") },
      { find: "@auth", replacement: path.resolve(__dirname, "src/domains/auth") },
      { find: "@auth-profile", replacement: path.resolve(__dirname, "src/domains/auth/auth-profile") },
      { find: "@dashboard", replacement: path.resolve(__dirname, "src/domains/dashboard") },
      { find: "@matches", replacement: path.resolve(__dirname, "src/domains/matches") },
      { find: "@players", replacement: path.resolve(__dirname, "src/domains/players") },
      { find: "@shared", replacement: path.resolve(__dirname, "src/shared") },
    ],
  },
});
