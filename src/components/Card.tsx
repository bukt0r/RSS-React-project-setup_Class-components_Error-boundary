import type { SearchResultItem } from '../types/item';

interface CardProps {
  item: SearchResultItem;
}

function Card({ item }: CardProps) {
  return (
    <article className="result-card">
      <h3 className="result-card__name">{item.name}</h3>
      <p className="result-card__description">{item.description}</p>
    </article>
  );
}

export default Card;
