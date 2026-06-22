'use client';

import { useTranslations } from 'next-intl';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('pagination');
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label={t('label')}>
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        {t('previous')}
      </button>
      <span className="pagination__status">
        {t('pageStatus', { current: currentPage, total: totalPages })}
      </span>
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        {t('next')}
      </button>
    </nav>
  );
}

export default Pagination;
