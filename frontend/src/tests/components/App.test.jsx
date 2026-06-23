import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

const mockUseAuth = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../components/error/ErrorBoundary', () => ({
  default: ({ children }) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('../../components/layout/MainLayout', () => ({
  default: () => <div data-testid="main-layout"><div data-testid="outlet">Outlet Content</div></div>,
}));

describe('App', () => {
  it('Debe renderizar sin errores', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('Debe mostrar login cuando no está autenticado', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    render(<App />);
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('UniScheduler')).toBeInTheDocument();
  });

  it('Debe mostrar dashboard cuando está autenticado', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });
    render(<App />);
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});
