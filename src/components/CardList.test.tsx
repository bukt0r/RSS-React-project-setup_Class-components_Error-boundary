import { render, screen, within } from '@testing-library/react';
import CardList from './CardList';

describe('CardList', () => {
  it('shows empty state when items array is empty', () => {
    render(<CardList items={[]} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No results to show yet.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders a list with one card per item', () => {
    render(
      <CardList
        items={[
          { id: '1', name: 'First', description: 'Desc A' },
          { id: '2', name: 'Second', description: 'Desc B' },
        ]}
      />
    );

    const list = screen.getByRole('list');
    const listItems = within(list).getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    expect(
      within(listItems[0]).getByRole('heading', { level: 3, name: 'First' })
    ).toBeInTheDocument();
    expect(within(listItems[0]).getByText('Desc A')).toBeInTheDocument();
    expect(
      within(listItems[1]).getByRole('heading', { level: 3, name: 'Second' })
    ).toBeInTheDocument();
    expect(within(listItems[1]).getByText('Desc B')).toBeInTheDocument();
  });

  it('renders two distinct rows when two items share the same name', () => {
    render(
      <CardList
        items={[
          { id: '1', name: 'Same', description: 'One' },
          { id: '2', name: 'Same', description: 'Two' },
        ]}
      />
    );

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getByText('One')).toBeInTheDocument();
    expect(within(list).getByText('Two')).toBeInTheDocument();
  });
});
