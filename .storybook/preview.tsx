import type { Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "../src/App";
import "@shared/style/root.css";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

const GalaxyViewports = {
  GalaxyS24: {
    name: "Galaxy S24",
    styles: {
      width: "360px",
      height: "647px",
    },
  },
  GalaxyS24Plus: {
    name: "Galaxy S24 Plus",
    styles: {
      width: "384px",
      height: "701px",
    },
  },
  GalaxyS24Ultra: {
    name: "Galaxy S24 Ultra",
    styles: {
      width: "384px",
      height: "701px",
    },
  },
};

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
