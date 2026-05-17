import { render, screen, within } from '@testing-library/react';
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
      />
    );

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' })
    ).toBeInTheDocument();
    expect(screen.getByText('Human from Tatooine')).toBeInTheDocument();
  });

  it('renders when name and description are empty strings', () => {
    render(
      <Card
        item={{
          id: '2',
          name: '',
          description: '',
        }}
      />
    );

    const article = screen.getByRole('article');
    expect(
      within(article).getByRole('heading', { level: 3 })
    ).toHaveTextContent('');
    expect(within(article).getByRole('paragraph')).toHaveTextContent('');
  });
});
