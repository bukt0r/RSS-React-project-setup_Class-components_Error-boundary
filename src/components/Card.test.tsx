import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { createSearchResultItem } from '../test-utils/createSearchResultItem';
import { renderWithProviders } from '../test-utils/renderWithProviders';

const sampleItem = createSearchResultItem('5', 'Leia', 'Princess');

describe('Card', () => {
  it('renders item name and description', () => {
    renderWithProviders(
      <Card
        item={sampleItem}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Leia' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Princess')).toBeInTheDocument();
  });

  it('calls onOpenDetails when card body is clicked', async () => {
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();

    renderWithProviders(
      <Card
        item={sampleItem}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Leia/i }));

    expect(onOpenDetails).toHaveBeenCalledWith('5');
  });

  it('calls onToggleCheck when checkbox is changed', async () => {
    const user = userEvent.setup();
    const onToggleCheck = vi.fn();

    renderWithProviders(
      <Card
        item={sampleItem}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={onToggleCheck}
        onOpenDetails={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select Leia' }));

    expect(onToggleCheck).toHaveBeenCalledWith(sampleItem);
  });

  it('uses fallback checkbox label when item name is empty', () => {
    renderWithProviders(
      <Card
        item={createSearchResultItem('2', '', '')}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Select item' })).toBeInTheDocument();
  });
});
