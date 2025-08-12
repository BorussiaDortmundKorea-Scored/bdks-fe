import type { Meta, StoryObj } from "@storybook/react-vite";
import PlayerRatingRotator from "@players/players-rating-rotator/components/player-rating-rotator/player-rating-rotator";
import PlayerRatingRotatorSkeleton from "@players/players-rating-rotator/components/player-rating-rotator/skeleton/player-rating-rotator-skeleton";
import PlayerRatingRotatorErrorFallback from "@players/players-rating-rotator/components/player-rating-rotator/error/player-rating-rotator-error-fallback";

const meta: Meta<typeof PlayerRatingRotator> = {
  title: "Shared/PlayerRatingRotator",
  component: PlayerRatingRotator,
};

export default meta;

type Story = StoryObj<typeof PlayerRatingRotator>;

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
  render: () => <PlayerRatingRotatorSkeleton />,
};

export const Error: Story = {
  render: () => <PlayerRatingRotatorErrorFallback />,
};
