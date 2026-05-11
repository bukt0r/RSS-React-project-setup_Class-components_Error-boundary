import { Component } from 'react';
import type { SearchResultItem } from '../types/item';

interface CardProps {
  item: SearchResultItem;
}

class Card extends Component<CardProps> {
  render() {
    const { item } = this.props;

    return (
      <article className="result-card">
        <h3 className="result-card__name">{item.name}</h3>
        <p className="result-card__description">{item.description}</p>
      </article>
    );
  }
}

export default Card;
