import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "storybook-addon-remix-react-router",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  env: (config) => ({
    ...config,
    VITE_SUPABASE_URL: "https://dummy.supabase.co",
    VITE_SUPABASE_ANON_KEY: "dummy-key",
  }),
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@admin": path.resolve(__dirname, "../src/domains/admin"),
        "@animals": path.resolve(__dirname, "../src/domains/animals"),
        "@auth": path.resolve(__dirname, "../src/domains/auth"),
        "@auth-profile": path.resolve(__dirname, "../src/domains/auth/auth-profile"),
        "@dashboard": path.resolve(__dirname, "../src/domains/dashboard"),
        "@matches": path.resolve(__dirname, "../src/domains/matches"),
        "@players": path.resolve(__dirname, "../src/domains/players"),
        "@shared": path.resolve(__dirname, "../src/shared"),
      };
    }
    return config;
  },
};
export default config;
