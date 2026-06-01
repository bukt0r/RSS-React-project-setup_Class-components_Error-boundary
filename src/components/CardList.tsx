import Card from './Card';
import type { SearchResultItem } from '../types/item';

interface CardListProps {
  items: SearchResultItem[];
  detailsId: string | null;
  onOpenDetails: (id: string) => void;
  isItemChecked: (id: string) => boolean;
  onToggleItemCheck: (item: SearchResultItem) => void;
}

function CardList({
  items,
  detailsId,
  onOpenDetails,
  isItemChecked,
  onToggleItemCheck,
}: CardListProps) {
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
            isChecked={isItemChecked(item.id)}
            isDetailsActive={detailsId === item.id}
            onToggleCheck={onToggleItemCheck}
            onOpenDetails={onOpenDetails}
          />
        </li>
      ))}
    </ul>
  );
}

export default CardList;
