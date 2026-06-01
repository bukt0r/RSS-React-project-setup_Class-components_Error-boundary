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
  if (selectedCount === 0) {
    return null;
  }

  const itemLabel = selectedCount === 1 ? 'item' : 'items';

  return (
    <aside
      className="selection-flyout"
      role="region"
      aria-label="Selected items summary"
      aria-live="polite"
    >
      <p className="selection-flyout__count">
        {selectedCount} {itemLabel} selected
      </p>
      <div className="selection-flyout__actions">
        <button type="button" onClick={onUnselectAll}>
          Unselect all
        </button>
        <button type="button" onClick={onDownload}>
          Download
        </button>
      </div>
    </aside>
  );
}

export default SelectionFlyout;
