import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertPanel from '../../components/ui/AlertPanel';

describe('AlertPanel', () => {
  it('No debe renderizar nada si alerts está vacío', () => {
    const { container } = render(<AlertPanel alerts={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('Debe renderizar alertas correctamente', () => {
    const alerts = [
      { type: 'warning', message: 'Cuidado con esto' },
      { type: 'success', message: 'Operación exitosa' },
      { type: 'error', message: 'Error crítico' },
      { type: 'info', message: 'Información importante' },
    ];
    render(<AlertPanel alerts={alerts} />);
    expect(screen.getByText('Cuidado con esto')).toBeInTheDocument();
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    expect(screen.getByText('Error crítico')).toBeInTheDocument();
    expect(screen.getByText('Información importante')).toBeInTheDocument();
  });

  it('Debe mostrar el contador de alertas', () => {
    const alerts = [
      { type: 'warning', message: 'Alerta 1' },
      { type: 'info', message: 'Alerta 2' },
    ];
    render(<AlertPanel alerts={alerts} />);
    expect(screen.getByText('2 alerta(s)')).toBeInTheDocument();
  });
});
