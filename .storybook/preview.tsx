import { BrowserRouter } from "react-router-dom";

import { GalaxyViewports } from "./constant/galaxy-viewport";
import type { Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { handlers } from "@shared/mocks/handlers/handlers";
import { queryClient } from "@shared/provider/query-client";
import "@shared/style/root.css";

initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        ...GalaxyViewports,
      },
    },
    msw: {
      handlers: [...handlers],
    },
  },
  loaders: [mswLoader],
  initialGlobals: {
    viewport: { value: "iphone5", isRotated: false },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </BrowserRouter>
    ),
  ],
};

export default preview;
