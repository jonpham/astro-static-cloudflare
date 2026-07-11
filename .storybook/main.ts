import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    config.plugins ??= [];
    config.plugins.push(tailwindcss());

    return config;
  },
};

export default config;
