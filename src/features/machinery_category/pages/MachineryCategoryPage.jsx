import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
// import { useMachineryCategories } from "../hooks/useMachineryCategories"; 
import { useMachineryCategories } from "../hooks/useMachineryCategories";
import MachineryCategoryForm from "../components/MachineryCategoryForm";
import './MachineryCategoryPage.css' 


const MachineryCategoryPage = () => {
  const { categories, cargarCategorias, eliminarCategoria } = useMachineryCategories();
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const categoriasFiltradas = useMemo(() => {
    const datos = Array.isArray(categories) ? categories : [];
    const termino = busqueda.toLowerCase();
    
    return datos.filter(cat => {
      const nombreCat = (cat.category_name || '').toLowerCase();
      const idCat = cat.category_id?.toString() || '';
      return nombreCat.includes(termino) || idCat.includes(termino);
    });
  }, [categories, busqueda]);

  const prepararEdicion = (cat) => {
    setIsEditing(true);
    setFormData({
      category_id: cat.category_id,
      categoryName: cat.category_name
    });
    setMostrarModalForm(true);
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="header-text">
          <h1>Categorías de Maquinaria</h1>
          <p>Gestión de categorías - Makand</p>
        </div>

        <div className="header-actions">
          <div className="search-container-small">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar categoría..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <button 
            className="btn-nuevo"
            onClick={() => {
              setIsEditing(false);
              setFormData({}); 
              setMostrarModalForm(true);
            }}
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la Categoría</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => (
                <tr key={cat.category_id}>
                  <td>#{cat.category_id}</td>
                  <td>{cat.category_name}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit" title="Editar" onClick={() => prepararEdicion(cat)}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" title="Eliminar" onClick={() => eliminarCategoria(cat.category_id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-row" style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron coincidencias para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MachineryCategoryForm 
        isOpen={mostrarModalForm} 
        onClose={async () => { 
          setMostrarModalForm(false); 
          await cargarCategorias(); 
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MachineryCategoryPage;