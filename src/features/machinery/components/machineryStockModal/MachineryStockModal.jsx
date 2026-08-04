import { X } from 'lucide-react';
import './MachineryStockModal.css';

const MachineryStockModal = ({ isOpen, onClose, machinery, stockList, loadingStock, stockPagination, cambiarPaginaStock }) => {
  if (!isOpen || !machinery) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No programada';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-container-large">
        <div className="modal-header">
          <h2>Equipos - {machinery.machinery_name}</h2>
          <button onClick={onClose} className="close-button" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {loadingStock ? (
            <div className="stock-loading">Cargando equipos...</div>
          ) : stockList.length === 0 ? (
            <div className="stock-empty">No hay registros de stock para esta maquinaria.</div>
          ) : (
            <>
              <div className="stock-table-wrapper">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>ID Stock</th>
                      <th>N° Serie</th>
                      <th>Estado</th>
                      <th>Cantidad</th>
                      <th>Propiedad</th>
                      <th>Próxima Revisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockList.map((stock) => (
                      <tr key={stock.stock_id}>
                        <td>#{stock.stock_id}</td>
                        <td>{stock.serial_number || '—'}</td>
                        <td>
                          <span className={`status-badge status-${stock.status_name?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {stock.status_name}
                          </span>
                        </td>
                        <td>{stock.stock_quantity}</td>
                        <td>{stock.is_owned ? 'Propio' : 'Subcontratado'}</td>
                        <td>{formatDate(stock.next_revision_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="stock-pagination">
                <span className="stock-pagination-info">
                  Página {stockPagination.page} de {stockPagination.totalPages} · {stockPagination.total} registros
                </span>
                <div className="stock-pagination-buttons">
                  <button
                    className="btn-page"
                    disabled={stockPagination.page <= 1}
                    onClick={() => cambiarPaginaStock(stockPagination.page - 1)}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn-page"
                    disabled={stockPagination.page >= stockPagination.totalPages}
                    onClick={() => cambiarPaginaStock(stockPagination.page + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineryStockModal;
