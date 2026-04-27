import './DataTable.css';

/**
 * DataTable — Generic reusable table component for CRUD pages.
 * 
 * Props:
 * - columns: Array of { key, label, render? }
 * - data: Array of objects
 * - emptyMessage: String shown when data is empty
 * - onRowClick: Optional callback (row) => void
 */
export default function DataTable({ columns = [], data = [], emptyMessage = 'No hay registros', onRowClick }) {
  return (
    <div className="data-table-wrapper">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row._id || idx}
                className={onRowClick ? 'clickable-row' : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
