import { render, screen } from '@testing-library/react';
import ErrorBanner from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorBanner message={null} />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders nothing when message is an empty string', () => {
    const { container } = render(<ErrorBanner message="" />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders alert with message when message is provided', () => {
    render(<ErrorBanner message="Request failed" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Request failed');
  });
});
