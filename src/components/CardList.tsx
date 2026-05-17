import Card from './Card';
import type { SearchResultItem } from '../types/item';

interface CardListProps {
  items: SearchResultItem[];
  selectedId: string | null;
  onItemSelect: (id: string) => void;
}

function CardList({ items, selectedId, onItemSelect }: CardListProps) {
  if (items.length === 0) {
    return (
      <p className="results-empty" role="status">
        No results to show yet.
      </p>
    );
  }

  return (
    <ul className="result-list">
      {items.map((item, index) => (
        <li key={`${item.name}-${index}`} className="result-list__item">
          <Card
            item={item}
            isSelected={selectedId === item.id}
            onSelect={onItemSelect}
          />
        </li>
      ))}
    </ul>
  );
}

export default CardList;
