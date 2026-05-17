import type { SearchResultItem } from '../types/item';

interface CardProps {
  item: SearchResultItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function Card({ item, isSelected, onSelect }: CardProps) {
  return (
    <button
      type="button"
      className={`result-card ${isSelected ? 'result-card--selected' : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
    >
      <h3 className="result-card__name">{item.name}</h3>
      <p className="result-card__description">{item.description}</p>
    </button>
  );
}

export default Card;
