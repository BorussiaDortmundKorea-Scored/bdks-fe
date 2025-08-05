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
        "@shared": path.resolve(__dirname, "../src/shared"),
        "@players": path.resolve(__dirname, "../src/domains/players"),
        "@auth": path.resolve(__dirname, "../src/domains/auth"),
      };
    }
    return config;
  },
};
export default config;
