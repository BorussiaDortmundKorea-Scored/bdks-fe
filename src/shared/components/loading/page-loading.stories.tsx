import PageLoading from "./page-loading";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PageLoading> = {
  title: "Shared/PageLoading",
  component: PageLoading,
};

export default meta;

type Story = StoryObj<typeof PageLoading>;

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
