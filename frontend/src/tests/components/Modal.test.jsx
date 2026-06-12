import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../../components/ui/Modal';

describe('Modal', () => {
  it('No debe renderizar nada si isOpen es false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Contenido</p>
      </Modal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('Debe renderizar cuando isOpen es true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Título Modal">
        <p>Contenido del modal</p>
      </Modal>
    );
    expect(screen.getByText('Título Modal')).toBeInTheDocument();
    expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
  });

  it('Debe llamar onClose al hacer clic en overlay', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenido</p>
      </Modal>
    );
    const overlay = screen.getByText('Contenido').parentElement.parentElement;
    const modalOverlay = overlay.parentElement;
    fireEvent.click(modalOverlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('No debe llamar onClose al hacer clic dentro del modal', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenido</p>
      </Modal>
    );
    const content = screen.getByText('Contenido');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Debe llamar onClose al hacer clic en botón de cerrar', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Contenido</p>
      </Modal>
    );
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
