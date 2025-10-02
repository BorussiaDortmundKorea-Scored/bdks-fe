import { GalaxyViewports } from "./constant/galaxy-viewport";
import type { Preview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { handlers } from "@shared/mocks/handlers/handlers";
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
};

export default preview;
