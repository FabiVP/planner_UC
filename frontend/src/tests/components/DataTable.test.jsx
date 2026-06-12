import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTable from '../../components/ui/DataTable';

describe('DataTable', () => {
  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
  ];

  it('Debe renderizar los encabezados de columna', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('Debe renderizar datos correctamente', () => {
    const data = [
      { name: 'Juan', email: 'juan@test.com' },
      { name: 'María', email: 'maria@test.com' },
    ];
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('María')).toBeInTheDocument();
  });

  it('Debe mostrar mensaje vacío cuando no hay datos', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="No hay registros" />);
    expect(screen.getByText('No hay registros')).toBeInTheDocument();
  });

  it('Debe mostrar mensaje vacío por defecto', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No hay registros')).toBeInTheDocument();
  });

  it('Debe usar render personalizado si se proporciona', () => {
    const columnsWithRender = [
      { key: 'name', label: 'Nombre', render: (val) => `Sr. ${val}` },
    ];
    render(<DataTable columns={columnsWithRender} data={[{ name: 'Juan' }]} />);
    expect(screen.getByText('Sr. Juan')).toBeInTheDocument();
  });

  it('Debe llamar onRowClick al hacer clic en fila', () => {
    const onRowClick = vi.fn();
    const data = [{ _id: '1', name: 'Juan' }];
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    const row = screen.getByText('Juan').closest('tr');
    row.click();
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
