import LoginPage from "./login-page";
import type { Meta, StoryObj } from "@storybook/react-vite";

import PlayersRatingRotatorErrorFallback from "@players/players-rating-rotator/components/error/players-rating-rotator-error-fallback";
import PlayersRatingRotatorSkeleton from "@players/players-rating-rotator/components/skeleton/players-rating-rotator-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof LoginPage> = {
  title: "Auth/LoginPage",
  component: LoginPage,

  decorators: [
    (Story) => (
      <ReactQueryBoundary skeleton={<PlayersRatingRotatorSkeleton />} errorFallback={PlayersRatingRotatorErrorFallback}>
        <Story />
      </ReactQueryBoundary>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoginPage>;

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
