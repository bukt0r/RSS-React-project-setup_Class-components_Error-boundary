import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card', () => {
  it('renders item name and description', () => {
    render(
      <Card
        item={{
          id: '1',
          name: 'Luke Skywalker',
          description: 'Human from Tatooine',
        }}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Human from Tatooine')).toBeInTheDocument();
  });

  it('calls onSelect with item id when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Card
        item={{
          id: '5',
          name: 'Leia',
          description: 'Princess',
        }}
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Leia/i }));
    expect(onSelect).toHaveBeenCalledWith('5');
  });

  it('renders when name and description are empty strings', () => {
    render(
      <Card
        item={{
          id: '2',
          name: '',
          description: '',
        }}
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    const card = screen.getByRole('button');
    expect(within(card).getByRole('heading', { level: 3 })).toHaveTextContent('');
    expect(within(card).getByRole('paragraph')).toHaveTextContent('');
  });
});
