import type { Meta, StoryObj } from "@storybook/react-vite";

import PlayersRatingRotatorErrorFallback from "@players/players-rating-rotator/components/error/players-rating-rotator-error-fallback";
import PlayersRatingRotator from "@players/players-rating-rotator/components/players-rating-rotator";
import PlayersRatingRotatorSkeleton from "@players/players-rating-rotator/components/skeleton/players-rating-rotator-skeleton";

const meta: Meta<typeof PlayersRatingRotator> = {
  title: "Players/PlayersRatingRotator",
  component: PlayersRatingRotator,
};

export default meta;

type Story = StoryObj<typeof PlayersRatingRotator>;

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

export const Loading: Story = {
  render: () => <PlayersRatingRotatorSkeleton />,
};

export const Error: Story = {
  render: () => <PlayersRatingRotatorErrorFallback />,
};
