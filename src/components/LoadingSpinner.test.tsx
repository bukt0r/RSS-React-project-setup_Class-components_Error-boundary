import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders status role with default label text', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders custom label text when label prop is provided', () => {
    render(<LoadingSpinner label="Fetching characters" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Fetching characters')).toBeInTheDocument();
  });
});
