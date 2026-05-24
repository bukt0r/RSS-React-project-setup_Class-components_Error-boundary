import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

const sampleItem = {
  id: '5',
  name: 'Leia',
  description: 'Princess',
};

describe('Card', () => {
  it('renders item name and description', () => {
    render(
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
    expect(screen.getByRole('checkbox', { name: 'Select Leia' })).toBeInTheDocument();
  });

  it('calls onOpenDetails when card body is clicked', async () => {
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();

    render(
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

  it('calls onToggleCheck when checkbox is clicked without opening details', async () => {
    const user = userEvent.setup();
    const onToggleCheck = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <Card
        item={sampleItem}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={onToggleCheck}
        onOpenDetails={onOpenDetails}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select Leia' }));
    expect(onToggleCheck).toHaveBeenCalledWith(sampleItem);
    expect(onOpenDetails).not.toHaveBeenCalled();
  });

  it('renders when name and description are empty strings', () => {
    render(
      <Card
        item={{
          id: '2',
          name: '',
          description: '',
        }}
        isChecked={false}
        isDetailsActive={false}
        onToggleCheck={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    const body = screen.getByRole('button');
    expect(within(body).getByRole('heading', { level: 3 })).toHaveTextContent('');
    expect(within(body).getByRole('paragraph')).toHaveTextContent('');
    expect(screen.getByRole('checkbox', { name: 'Select item' })).toBeInTheDocument();
  });
});
