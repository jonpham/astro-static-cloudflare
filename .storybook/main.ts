import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
};

export default config;
