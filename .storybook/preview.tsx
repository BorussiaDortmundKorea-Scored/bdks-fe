import type { Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "../src/App";
import "@shared/style/root.css";
import { handlers } from "@shared/mocks/handlers/handlers";

import { INITIAL_VIEWPORTS } from "storybook/viewport";
import { GalaxyViewports } from "./constant/galaxy-viewport";

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
