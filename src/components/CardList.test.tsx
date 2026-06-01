import { render, screen, within } from '@testing-library/react';
import CardList from './CardList';
import { createSearchResultItem } from '../test-utils/createSearchResultItem';

const defaultHandlers = {
  detailsId: null,
  onOpenDetails: vi.fn(),
  isItemChecked: () => false,
  onToggleItemCheck: vi.fn(),
};

describe('CardList', () => {
  it('shows empty state when items array is empty', () => {
    render(<CardList items={[]} {...defaultHandlers} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No results to show yet.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders a list with one card per item', () => {
    render(
      <CardList
        items={[
          createSearchResultItem('1', 'First', 'Desc A'),
          createSearchResultItem('2', 'Second', 'Desc B'),
        ]}
        {...defaultHandlers}
      />,
    );

    const list = screen.getByRole('list');
    const listItems = within(list).getAllByRole('listitem');
    expect(listItems).toHaveLength(2);

    expect(
      within(listItems[0]).getByRole('heading', { level: 3, name: 'First' }),
    ).toBeInTheDocument();
    expect(within(listItems[0]).getByText('Desc A')).toBeInTheDocument();
    expect(
      within(listItems[1]).getByRole('heading', { level: 3, name: 'Second' }),
    ).toBeInTheDocument();
    expect(within(listItems[1]).getByText('Desc B')).toBeInTheDocument();
  });

  it('reflects checked state from isItemChecked', () => {
    render(
      <CardList
        items={[createSearchResultItem('1', 'First', 'Desc A')]}
        {...defaultHandlers}
        isItemChecked={(id) => id === '1'}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Select First' })).toBeChecked();
  });

  it('marks details-active card when detailsId matches', () => {
    render(
      <CardList
        items={[
          createSearchResultItem('1', 'Same', 'One'),
          createSearchResultItem('2', 'Same', 'Two'),
        ]}
        {...defaultHandlers}
        detailsId="2"
      />,
    );

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getByText('One')).toBeInTheDocument();
    expect(within(list).getByText('Two')).toBeInTheDocument();

    const articles = within(list).getAllByRole('article');
    expect(articles[0]).not.toHaveClass('result-card--details-active');
    expect(articles[1]).toHaveClass('result-card--details-active');
  });
});
