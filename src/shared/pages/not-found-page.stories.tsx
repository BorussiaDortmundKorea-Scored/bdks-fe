import NotFoundPage from "./not-found-page";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof NotFoundPage> = {
  title: "Shared/NotFoundPage",
  component: NotFoundPage,
};

export default meta;

type Story = StoryObj<typeof NotFoundPage>;

export const Iphone5: Story = {
  globals: {
    viewport: { value: "iphone5", isRotated: false },
  },
};

export const GalaxyS24: Story = {
  globals: {
    viewport: { value: "GalaxyS24", isRotated: false },
  },
};
