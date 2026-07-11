import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PageTree } from './PageTree';

const meta = {
  title: 'Components/PageTree',
  component: PageTree,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageTree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: /404/i })).toHaveAttribute(
      'href',
      '/404',
    );
    await expect(canvas.getByRole('link', { name: /error/i })).toHaveAttribute(
      'href',
      '/error',
    );
  },
};
