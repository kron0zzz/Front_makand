import { useState, useEffect, useMemo } from 'react';
import { vehiculosService } from '../services/vehiculosService';
import { Plus, Search, Eye, Edit, Trash2, X, Loader2 } from 'lucide-react';
import Vehiculo from '../components/Vehiculo';
import './VehiculosPage.css';
import '../components/Vehiculo.css';

const VehiculosPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');

  // Modal states
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [vehiculoVer, setVehiculoVer] = useState(null);

  // Delete confirm
  const [eliminandoId, setEliminandoId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await vehiculosService.obtenerTodos();
        setVehiculos(data);
      } catch {
        setError('Error al cargar vehículos. Verifica que el backend esté en ejecución.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtering by search AND tab
  const filtrados = useMemo(() => {
    let result = vehiculos;
    if (tab === 'activos') result = result.filter(v => v.estado === 'Activo');
    if (tab === 'inactivos') result = result.filter(v => v.estado === 'Inactivo');
    const s = search.toLowerCase().trim();
    if (s) result = result.filter(v =>
      v.placa?.toLowerCase().includes(s) ||
      v.marca?.toLowerCase().includes(s) ||
      v.modelo?.toLowerCase().includes(s)
    );
    return result;
  }, [vehiculos, search, tab]);

  // Handlers
  const abrirNuevo = () => {
    setVehiculoEditando(null);
    setModalAbierto(true);
  };

  const abrirEditar = (vehiculo) => {
    setVehiculoEditando(vehiculo);
    setModalAbierto(true);
  };

  const guardar = async (datos) => {
    try {
      if (vehiculoEditando) {
        await vehiculosService.actualizar(vehiculoEditando.id, datos);
        setVehiculos(prev => prev.map(v => v.id === vehiculoEditando.id ? { ...v, ...datos } : v));
        setToast({ tipo: 'success', mensaje: 'Vehículo actualizado correctamente.' });
      } else {
        await vehiculosService.crear(datos);
        setToast({ tipo: 'success', mensaje: 'Vehículo registrado correctamente.' });
      }
      setModalAbierto(false);
      setVehiculoEditando(null);
      cargar();
    } catch {
      setToast({ tipo: 'error', mensaje: 'Error al guardar el vehículo.' });
    }
  };

  const eliminar = async () => {
    if (!eliminandoId) return;
    try {
      await vehiculosService.eliminar(eliminandoId);
      setVehiculos(prev => prev.filter(v => v.id !== eliminandoId));
      setToast({ tipo: 'success', mensaje: 'Vehículo eliminado correctamente.' });
    } catch {
      setToast({ tipo: 'error', mensaje: 'Error al eliminar el vehículo.' });
    } finally {
      setEliminandoId(null);
    }
  };

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vehiculosService.obtenerTodos();
      setVehiculos(data);
    } catch {
      setError('Error al cargar vehículos. Verifica que el backend esté en ejecución.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehiculos-page-container">
      {/*──── HEADER ────*/}
      <div className="vpage-header">
        <div className="vpage-header-text">
          <h1>Gestión de Vehículos</h1>
          <p>Administra la flota de vehículos registrados en el sistema</p>
        </div>
        <div className="vpage-header-badge">
          {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} registrado{vehiculos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/*──── SEARCH ────*/}
      <div className="vsearch-wrapper">
        <span className="vsearch-icon"><Search size={16} /></span>
        <input
          className="vsearch-input"
          type="text"
          placeholder="Buscar por placa, marca o modelo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/*──── MANAGEMENT HEADER ────*/}
      <div className="vmgmt-header">
        <div>
          <h2>{tab === 'todos' ? 'Todos los vehículos' : tab === 'activos' ? 'Vehículos activos' : 'Vehículos inactivos'}</h2>
          <p>{filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="vmgmt-right">
          <div className="vtabs">
            <button className={`vtab ${tab === 'todos' ? 'vtab--active' : ''}`} onClick={() => setTab('todos')}>Todos</button>
            <button className={`vtab ${tab === 'activos' ? 'vtab--active' : ''}`} onClick={() => setTab('activos')}>Activos</button>
            <button className={`vtab ${tab === 'inactivos' ? 'vtab--active' : ''}`} onClick={() => setTab('inactivos')}>Inactivos</button>
          </div>
          <button className="vbtn-orange" onClick={abrirNuevo}>
            <Plus size={18} />
            Nuevo vehículo
          </button>
        </div>
      </div>

      {/*──── ERROR BANNER ────*/}
      {error && <div className="vbanner vbanner--error">{error}</div>}

      {/*──── TABLE ────*/}
      <div className="vtable-card">
        {loading ? (
          <div className="vcell-empty">
            <Loader2 size={28} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="vcell-empty">
            {search ? 'No hay resultados que coincidan con la búsqueda.' : 'No hay vehículos registrados.'}
          </div>
        ) : (
          <table className="vtable">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Capacidad (kg)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(v => (
                <tr key={v.id}>
                  <td className="vcell vcell--placa">{v.placa}</td>
                  <td className="vcell">{v.marca}</td>
                  <td className="vcell">{v.modelo}</td>
                  <td className="vcell">{v.capacidadKg ? Number(v.capacidadKg).toLocaleString() : '—'}</td>
                  <td className="vcell">
                    <span className={`vbadge ${v.estado === 'Activo' ? 'vbadge--active' : 'vbadge--inactive'}`}>
                      <span className="vw-dot" />
                      {v.estado}
                    </span>
                  </td>
                  <td className="vcell vcell--actions">
                    <div className="vaction-row">
                      <button className="vbtn-icon vbtn-view" title="Ver" onClick={() => setVehiculoVer(v)}>
                        <Eye size={16} />
                      </button>
                      <button className="vbtn-icon vbtn-edit" title="Editar" onClick={() => abrirEditar(v)}>
                        <Edit size={16} />
                      </button>
                      <button className="vbtn-icon vbtn-delete" title="Eliminar" onClick={() => setEliminandoId(v.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/*──── VIEW MODAL ────*/}
      {vehiculoVer && (
        <div className="vmodal-overlay" onClick={() => setVehiculoVer(null)}>
          <div className="vmodal-box vmodal-box--view" onClick={e => e.stopPropagation()}>
            <div className="vmodal-header">
              <h3>Detalles del vehículo</h3>
              <button className="vmodal-close" onClick={() => setVehiculoVer(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="vview-grid">
              <div className="vview-item">
                <span className="vview-label">Marca</span>
                <span className="vview-value">{vehiculoVer.marca}</span>
              </div>
              <div className="vview-item">
                <span className="vview-label">Modelo</span>
                <span className="vview-value">{vehiculoVer.modelo}</span>
              </div>
              <div className="vview-item">
                <span className="vview-label">Placa</span>
                <span className="vview-value vview-value--placa">{vehiculoVer.placa}</span>
              </div>
              <div className="vview-item">
                <span className="vview-label">Capacidad</span>
                <span className="vview-value">{vehiculoVer.capacidadKg ? Number(vehiculoVer.capacidadKg).toLocaleString() + ' kg' : '—'}</span>
              </div>
              <div className="vview-item">
                <span className="vview-label">Estado</span>
                <span className={`vbadge ${vehiculoVer.estado === 'Activo' ? 'vbadge--active' : 'vbadge--inactive'}`}>
                  <span className="vw-dot" />
                  {vehiculoVer.estado}
                </span>
              </div>
            </div>
            <div className="vview-actions">
              <button className="vbtn-secondary" onClick={() => setVehiculoVer(null)}>Cerrar</button>
              <button className="vbtn-orange" onClick={() => { setVehiculoVer(null); abrirEditar(vehiculoVer); }}>
                <Edit size={16} />
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*──── EDIT MODAL ────*/}
      {modalAbierto && (
        <div className="vmodal-overlay" onClick={() => { setModalAbierto(false); setVehiculoEditando(null); }}>
          <div className="vmodal-box" onClick={e => e.stopPropagation()}>
            <div className="vmodal-header">
              <h3>{vehiculoEditando ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
              <button className="vmodal-close" onClick={() => { setModalAbierto(false); setVehiculoEditando(null); }}>
                <X size={18} />
              </button>
            </div>
            <div className="vmodal-form">
              {vehiculoEditando && (
                <div className="vview-item" style={{ marginBottom: '1rem' }}>
                  <span className="vview-label">Placa</span>
                  <span className="vview-value vview-value--placa">{vehiculoEditando.placa}</span>
                </div>
              )}
              <Vehiculo
                vehiculo={vehiculoEditando}
                isEditing={true}
                onSave={guardar}
                onCancel={() => { setModalAbierto(false); setVehiculoEditando(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/*──── DELETE CONFIRM ────*/}
      {eliminandoId !== null && (
        <div className="vmodal-overlay" onClick={() => setEliminandoId(null)}>
          <div className="vmodal-box vmodal-box--view" onClick={e => e.stopPropagation()} style={{ maxWidth: 430 }}>
            <div className="vmodal-header">
              <h3>Eliminar vehículo</h3>
            </div>
            <div className="vview-grid">
              <div className="vview-item" style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '.95rem', color: '#4b5563', lineHeight: 1.6 }}>
                  ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', padding: '1.25rem 1.5rem', borderTop: '1px solid var(--gray-100)' }}>
              <button className="vbtn-secondary" onClick={() => setEliminandoId(null)}>Cancelar</button>
              <button className="vbtn-icon vbtn-delete vbtn-icon--wide" onClick={eliminar}>
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*──── TOAST ────*/}
      {toast && (
        <div className={`vtoast ${toast.tipo === 'success' ? 'vtoast--success' : 'vtoast--error'}`}>
          {toast.mensaje}
        </div>
      )}
    </div>
  );
};

export default VehiculosPage;
