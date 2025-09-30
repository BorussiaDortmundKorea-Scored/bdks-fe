import MatchesHistoryPlayersRatingPage from "./matches-history-players-rating-page";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof MatchesHistoryPlayersRatingPage> = {
  title: "Matches/MatchesHistoryPlayersRatingPage",
  component: MatchesHistoryPlayersRatingPage,
};

export default meta;

type Story = StoryObj<typeof MatchesHistoryPlayersRatingPage>;

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
