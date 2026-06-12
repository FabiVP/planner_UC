import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

vi.mock('../../components/layout/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Mock</div>,
}));

vi.mock('../../components/layout/Header', () => ({
  default: () => <div data-testid="header">Header Mock</div>,
}));

describe('MainLayout', () => {
  it('Debe renderizar Sidebar, Header y Outlet container', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
