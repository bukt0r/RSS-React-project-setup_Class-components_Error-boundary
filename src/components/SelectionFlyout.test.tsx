import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectionFlyout from './SelectionFlyout';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('SelectionFlyout', () => {
  it('renders nothing when selected count is zero', () => {
    const { container } = renderWithProviders(
      <SelectionFlyout
        selectedCount={0}
        onUnselectAll={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows selected count and action buttons', () => {
    renderWithProviders(
      <SelectionFlyout
        selectedCount={3}
        onUnselectAll={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('region', { name: 'Selected items summary' }),
    ).toBeInTheDocument();
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Unselect all' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

  it('uses singular label for one selected item', () => {
    renderWithProviders(
      <SelectionFlyout
        selectedCount={1}
        onUnselectAll={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('calls action handlers when buttons are clicked', async () => {
    const user = userEvent.setup();
    const onUnselectAll = vi.fn();
    const onDownload = vi.fn();

    renderWithProviders(
      <SelectionFlyout
        selectedCount={2}
        onUnselectAll={onUnselectAll}
        onDownload={onDownload}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));
    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(onUnselectAll).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
