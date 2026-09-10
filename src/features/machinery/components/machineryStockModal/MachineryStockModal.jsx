import { X, Download } from 'lucide-react';
import { machineryService } from '../../services/machineryService';
import { useAlertModal } from "../../../../shared/alertModal";
import './MachineryStockModal.css';

const MachineryStockModal = ({ isOpen, onClose, machinery, stockList, loadingStock, stockPagination, cambiarPaginaStock }) => {
  const { showAlert } = useAlertModal();

  if (!isOpen || !machinery) return null;

  const handleGenerarPdf = async (stockId) => {
    try {
      const blob = await machineryService.generarPdf(stockId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoja-vida-equipo-${stockId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      await showAlert('No se pudo generar el PDF');
    }
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
                      <th>Acciones</th>
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
                        <td>
                          {stock.serial_number && (
                            <button
                              className="action-btn pdf"
                              title="Generar hoja de vida PDF"
                              onClick={() => handleGenerarPdf(stock.stock_id)}
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </td>
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
