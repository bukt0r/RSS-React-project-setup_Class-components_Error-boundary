'use client';

import type { ChangeEvent, MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import type { SearchResultItem } from '../types/item';

interface CardProps {
  item: SearchResultItem;
  isChecked: boolean;
  isDetailsActive: boolean;
  onToggleCheck: (item: SearchResultItem) => void;
  onOpenDetails: (id: string) => void;
}

function Card({
  item,
  isChecked,
  isDetailsActive,
  onToggleCheck,
  onOpenDetails,
}: CardProps) {
  const t = useTranslations('card');

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    onToggleCheck(item);
  };

  const handleCheckboxClick = (event: MouseEvent<HTMLInputElement>): void => {
    event.stopPropagation();
  };

  const handleBodyClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onOpenDetails(item.id);
  };

  const cardClassName = [
    'result-card',
    isDetailsActive ? 'result-card--details-active' : '',
    isChecked ? 'result-card--checked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const checkboxLabel = item.name
    ? t('selectNamed', { name: item.name })
    : t('selectItem');

  return (
    <article className={cardClassName}>
      <label className="result-card__checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          aria-label={checkboxLabel}
        />
      </label>
      <button
        type="button"
        className="result-card__body"
        onClick={handleBodyClick}
      >
        <h3 className="result-card__name">{item.name}</h3>
        <p className="result-card__description">{item.description}</p>
      </button>
    </article>
  );
}

export default Card;
