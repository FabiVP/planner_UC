import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QualityChart from '../../components/ui/QualityChart';

describe('QualityChart', () => {
  it('Debe renderizar con score por defecto', () => {
    render(<QualityChart />);
    expect(screen.getByText('Calidad de la solución (Última generación)')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Óptimo')).toBeInTheDocument();
  });

  it('Debe renderizar con score personalizado', () => {
    render(<QualityChart score={78} />);
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('Debe renderizar métricas con valores por defecto', () => {
    render(<QualityChart />);
    expect(screen.getByText('Restricciones cumplidas')).toBeInTheDocument();
    expect(screen.getByText('Preferencias satisfechas')).toBeInTheDocument();
    expect(screen.getByText('Uso de recursos')).toBeInTheDocument();
    expect(screen.getByText('Distribución de carga')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('Debe renderizar métricas personalizadas', () => {
    const metrics = { constraintsFulfilled: 85, preferencesScore: 80, resourceUsage: 75, loadDistribution: 90 };
    render(<QualityChart score={80} metrics={metrics} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('Debe renderizar con score 0 sin errores', () => {
    render(<QualityChart score={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('Debe renderizar con score 100 sin errores', () => {
    render(<QualityChart score={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
