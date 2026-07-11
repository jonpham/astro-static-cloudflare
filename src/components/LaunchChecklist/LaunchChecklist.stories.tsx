import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { LaunchChecklist } from './LaunchChecklist';

const meta = {
  title: 'Components/LaunchChecklist',
  component: LaunchChecklist,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LaunchChecklist>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('0 of 5 complete')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /react island/i }));
    await expect(canvas.getByText('1 of 5 complete')).toBeInTheDocument();
  },
};
