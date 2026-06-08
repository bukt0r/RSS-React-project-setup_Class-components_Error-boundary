import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

function renderModal(isOpen = true, onClose = vi.fn()) {
  return {
    onClose,
    ...render(
      <Modal isOpen={isOpen} title="Test modal" onClose={onClose}>
        <p>Modal body</p>
        <button type="button">Inside action</button>
      </Modal>,
    ),
  };
}

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = renderModal(false);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog in a portal when open', () => {
    renderModal();

    const dialog = screen.getByRole('dialog', { name: 'Test modal' });
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest('.modal-overlay')?.parentElement).toBe(document.body);
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking the overlay', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);

    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the dialog', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);

    await user.click(screen.getByText('Modal body'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);

    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus to the first focusable element when opened', () => {
    renderModal();

    expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();
  });
});
