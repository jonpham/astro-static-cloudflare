import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LaunchChecklist } from '../LaunchChecklist';

describe('LaunchChecklist', () => {
  it('renders the default boilerplate checklist items', () => {
    // Arrange / Act
    render(<LaunchChecklist />);

    // Assert
    expect(screen.getByRole('heading', { name: /launch checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /astro page shell/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react island/i })).toBeInTheDocument();
    expect(screen.getByText('0 of 5 complete')).toBeInTheDocument();
  });

  it('updates progress when a checklist item is toggled', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LaunchChecklist />);

    // Act
    await user.click(screen.getByRole('button', { name: /react island/i }));

    // Assert
    expect(screen.getByText('1 of 5 complete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /react island/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
