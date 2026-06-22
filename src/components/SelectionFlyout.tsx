'use client';

import { useTranslations } from 'next-intl';
import './SelectionFlyout.css';

interface SelectionFlyoutProps {
  selectedCount: number;
  onUnselectAll: () => void;
  onDownload: () => void;
}

function SelectionFlyout({
  selectedCount,
  onUnselectAll,
  onDownload,
}: SelectionFlyoutProps) {
  const t = useTranslations('selectionFlyout');
  const tActions = useTranslations('selectionFlyoutActions');

  if (selectedCount === 0) {
    return null;
  }

  return (
    <aside
      className="selection-flyout"
      role="region"
      aria-label={t('summary')}
      aria-live="polite"
    >
      <p className="selection-flyout__count">
        {t('selectedCount', { count: selectedCount })}
      </p>
      <div className="selection-flyout__actions">
        <button type="button" onClick={onUnselectAll}>
          {tActions('unselectAll')}
        </button>
        <button type="button" onClick={onDownload}>
          {tActions('download')}
        </button>
      </div>
    </aside>
  );
}

export default SelectionFlyout;
