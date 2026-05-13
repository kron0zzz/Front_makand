import { useState, useEffect, useCallback } from 'react';
import { Edit, Search, Plus } from 'lucide-react';
import { DataTable } from '../../../shared/components/DataTable';
import { Pagination } from '../../../shared/components/Pagination';
import { vehiculosService } from '../services/vehiculosService';

const VehiculosPage = () => {
  // Estados principales
  const [listaVehiculos, setListaVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({ placa: '', marca: '', modelo: '', capacidadKg: '', estado: true });
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  // 1. Función memorizada para evitar alertas de ESLint (image_3864fb.png)
  const cargarVehiculos = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const datos = await vehiculosService.obtenerTodos();
      setListaVehiculos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // 2. Efecto de carga inicial corregido (image_2e78b4.png)
  useEffect(() => {
    const fetchData = async () => {
      await cargarVehiculos();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editingVehiculo) {
        await vehiculosService.actualizar(editingVehiculo.id, formData);
      } else {
        await vehiculosService.crear(formData);
      }
      await cargarVehiculos();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al procesar la solicitud');
    }
  };

  // Filtrado de búsqueda
  const filtered = listaVehiculos.filter(v => 
    (v.placa || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (v.marca || '').toLowerCase().includes(busqueda.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Vehículos</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditingVehiculo(null);
            setFormData({placa:'', marca:'', modelo:'', capacidadKg:'', estado:true});
            setMostrarModal(true);
          }}
        >
          <Plus size={18} /> Nuevo Vehículo
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Buscar por placa o marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={[
          { header: 'Placa', accessor: 'placa' },
          { header: 'Marca', accessor: 'marca' },
          { header: 'Modelo', accessor: 'modelo' },
          { header: 'Capacidad (kg)', accessor: 'capacidadKg' },
          { header: 'Estado', accessor: 'estado' },
        ]}
        data={paged}
        loading={loading}
        renderActions={(row) => (
          <button 
            className="text-yellow-600 hover:text-yellow-700"
            onClick={() => {
              setEditingVehiculo(row);
              setFormData({
                placa: row.placa,
                marca: row.marca,
                modelo: row.modelo,
                capacidadKg: row.capacidadKg,
                estado: row.estado === 'Activo'
              });
              setMostrarModal(true);
            }}
          >
            <Edit size={18}/>
          </button>
        )}
      />

      <div className="mt-4">
        <Pagination 
          page={page} 
          totalPages={Math.ceil(filtered.length / pageSize)} 
          onPageChange={setPage} 
        />
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={guardar} className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingVehiculo ? 'Editar' : 'Registrar'} Vehículo</h2>
            <div className="space-y-4">
              <input className="w-full border p-2 rounded" placeholder="Marca" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} required />
              <input className="w-full border p-2 rounded" placeholder="Modelo" value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} required />
              <input className="w-full border p-2 rounded" placeholder="Placa" value={formData.placa} onChange={e => setFormData({...formData, placa: e.target.value})} required />
              <input className="w-full border p-2 rounded" type="number" placeholder="Capacidad Kg" value={formData.capacidadKg} onChange={e => setFormData({...formData, capacidadKg: e.target.value})} required />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" className="px-4 py-2 text-gray-500" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehiculosPage;