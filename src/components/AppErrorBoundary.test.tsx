import { Component } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppErrorBoundary from './AppErrorBoundary';

class CrashOnRender extends Component {
  render() {
    throw new Error('Boundary crash test');
    return null;
  }
}

describe('AppErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <AppErrorBoundary>
        <p>Safe content</p>
      </AppErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('shows fallback UI and allows retry after render error', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <AppErrorBoundary>
        <CrashOnRender />
      </AppErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(screen.getByText('Boundary crash test')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
