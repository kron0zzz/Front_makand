import React from 'react';
import './DataTable.css';

export const DataTable = ({ 
  columns, 
  data, 
  loading, 
  renderActions, 
  noDataText = 'No hay datos' 
}) => {
  if (loading) {
    return (
      <div className="datatable-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="datatable-container">
        <div className="no-data">{noDataText}</div>
      </div>
    );
  }

  return (
    <div className="datatable-container">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            {renderActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={`${row.id}-${col.accessor}`}>
                  {row[col.accessor]}
                </td>
              ))}
              {renderActions && (
                <td className="datatable-actions">{renderActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
