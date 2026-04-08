import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState } from "@/components/atoms/empty-state";
import { ErrorState } from "@/components/atoms/error-state";
import { LoadingState } from "@/components/atoms/loading-state";
import { SuccessState } from "@/components/atoms/success-state";

const meta: Meta = {
  title: "States/Atomic Components",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Loading: Story = {
  render: () => <LoadingState />,
};

export const Empty: Story = {
  render: () => <EmptyState />,
};

export const Error: Story = {
  render: () => (
    <ErrorState
      message="Unable to load appointments. Please try again."
      onRetry={() => undefined}
    />
  ),
};

export const Success: Story = {
  render: () => (
    <SuccessState
      title="Dashboard Ready"
      subtitle="Your upcoming visits and care tasks are available."
    />
  ),
};
