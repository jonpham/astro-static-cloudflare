import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageTree } from '../PageTree';

describe('PageTree', () => {
  it('renders only the default 404 and error route links', () => {
    // Arrange / Act
    render(<PageTree />);

    // Assert
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByRole('link', { name: /404/i })).toHaveAttribute(
      'href',
      '/404',
    );
    expect(screen.getByRole('link', { name: /error/i })).toHaveAttribute(
      'href',
      '/error',
    );
  });
});
