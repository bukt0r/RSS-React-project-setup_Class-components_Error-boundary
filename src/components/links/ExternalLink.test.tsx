import { render, screen } from '@testing-library/react';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('renders an external anchor with safe rel attributes', () => {
    render(
      <ExternalLink href="https://example.com/docs" className="external-link">
        Docs
      </ExternalLink>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(link).toHaveClass('external-link');
  });
});
