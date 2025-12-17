import { BrowserRouter } from "react-router-dom";

import AdminGridWrapper from "./admin-grid-wrapper";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AdminGridWrapper> = {
  component: AdminGridWrapper,
  title: "Provider/AdminGridWrapper",
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AdminGridWrapper>;

export const Iphone5: Story = {
  globals: {
    viewport: { value: "iphone5", isRotated: false },
  },
};

export const Iphone12: Story = {
  globals: {
    viewport: { value: "iphone12", isRotated: false },
  },
};

export const GalaxyS24: Story = {
  globals: {
    viewport: { value: "GalaxyS24", isRotated: false },
  },
};

export const GalaxyS24Plus: Story = {
  globals: {
    viewport: { value: "GalaxyS24Plus", isRotated: false },
  },
};

export const Desktop: Story = {
  globals: {
    viewport: { value: "desktop", isRotated: false },
  },
};
