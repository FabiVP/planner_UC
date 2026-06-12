import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from '../../components/error/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('Debe renderizar children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <p>Contenido normal</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  it('Debe mostrar mensaje de error cuando hay error', () => {
    const ThrowingComponent = () => {
      throw new Error('Error de prueba');
    };

    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    expect(screen.getByText('Recargar página')).toBeInTheDocument();
  });
});
