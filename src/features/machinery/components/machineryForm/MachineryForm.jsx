import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './MachineryForm.css'; 
import { useAlertModal } from "../../../../shared/alertModal";

// 🛠️ ACTUALIZADO: Ahora recibe crearMaquinaria y actualizarMaquinaria por props desde el padre
const MachineryForm = ({ isOpen, onClose, formData, setFormData, isEditing, crearMaquinaria, actualizarMaquinaria }) => {
  const { showAlert } = useAlertModal();

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errorForm, setErrorForm] = useState('');

  // 1. Carga inicial de opciones desde el backend
  useEffect(() => {
    const cargarOpcionesDelFormulario = async () => {
      try {
        setErrorForm('');
        const token = localStorage.getItem("token"); // Obtén el token
        
        // Añade el header de autorización a las peticiones
        const [resCategories, resStatuses] = await Promise.all([
          fetch('http://localhost:3000/api/machine-categories', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/machine-statuses', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (resCategories.ok) {
          const datosCat = await resCategories.json();
          setCategories(datosCat);
        }
        if (resStatuses.ok) {
          const datosStat = await resStatuses.json();
          setStatuses(datosStat);
        }
      } catch (error) {
        console.error("Error al cargar opciones de formulario:", error);
        setErrorForm('No se pudieron cargar los listados del formulario.');
      }
    };

    if (isOpen) {
      cargarOpcionesDelFormulario();
    }
  }, [isOpen]);

  // 🛠️ 2. Auto-emparejar listas si la base de datos solo retorna texto en la edición
  useEffect(() => {
    if (isOpen && isEditing) {
      setFormData((prevData) => {
        const newData = { ...prevData };
        let huboCambio = false;

        if (!newData.category_id && newData.category_name && categories.length > 0) {
          const encontrada = categories.find(c => 
            (c.category_name || c.machinery_category_name || '').toLowerCase() === newData.category_name.toLowerCase()
          );
          if (encontrada) {
            const id = encontrada.category_id || encontrada.machinery_category_id;
            newData.category_id = id ? id.toString() : '';
            huboCambio = true;
          }
        }

        if (!newData.status_id && newData.status_name && statuses.length > 0) {
          const encontrado = statuses.find(s => 
            (s.status_name || '').toLowerCase() === newData.status_name.toLowerCase()
          );
          if (encontrado) {
            newData.status_id = encontrado.status_id ? encontrado.status_id.toString() : '';
            huboCambio = true;
          }
        }

        return huboCambio ? newData : prevData;
      });
    }
  }, [isOpen, isEditing, categories, statuses, setFormData]);

  if (!isOpen) return null;

  // Limpiador de formatos decimales de moneda
  const limpiarPrecioFormato = (valor) => {
    if (valor === undefined || valor === null || valor === '') return 0;
    const stringLimpio = valor.toString().replace(/\./g, '').replace(/,/g, '');
    return parseFloat(stringLimpio) || 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      };

      // Control de cantidad si es motorizado
      if (name === 'is_motorized' && checked) {
        updatedData.stock_quantity = 1;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');
    
    const dataToSend = {
      category_id: parseInt(formData.category_id),
      machinery_name: formData.machinery_name,
      machinery_description: formData.machinery_description || '',
      sale_price: limpiarPrecioFormato(formData.sale_price),
      daily_rental_price: limpiarPrecioFormato(formData.daily_rental_price),
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      is_motorized: !!formData.is_motorized
    };

    const exito = isEditing 
      ? await actualizarMaquinaria(formData.machinery_id, dataToSend)
      : await crearMaquinaria(dataToSend);

    if (exito) {
      await showAlert(isEditing ? '¡Maquinaria actualizada con éxito!' : '¡Maquinaria registrada con éxito!');
      onClose(); 
    } else {
      setErrorForm('Ocurrió un problema en el servidor al intentar guardar la maquinaria.');
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Información de Maquinaria' : 'Registrar Nueva Maquinaria'}
          </h2>
          <button type="button" onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {errorForm && <div className="form-error-alert" style={{ color: 'red', padding: '10px 20px', fontWeight: 'bold' }}>{errorForm}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            <div>
              <label className="form-label">Código Interno</label>
              <input 
                type="text" 
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.machinery_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            <div>
              <label className="form-label">Nombre Maquinaria *</label>
              <input 
                name="machinery_name" 
                type="text" 
                className="form-input" 
                value={formData.machinery_name || ''} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="form-label">Categoría *</label>
              <select 
                name="category_id" 
                className="form-input"
                value={formData.category_id ? formData.category_id.toString() : ''} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((cat) => {
                  const id = cat.category_id || cat.machinery_category_id;
                  const name = cat.category_name || cat.machinery_category_name;
                  return (
                    <option key={id?.toString()} value={id?.toString()}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="form-label">Estado de la Máquina</label>
              <select 
                name="status_id" 
                className="form-input form-input-disabled"
                value={formData.status_id ? formData.status_id.toString() : ''} 
                disabled
              >
                <option value="">Seleccione un estado</option>
                {statuses.map((stat) => (
                  <option key={stat.status_id?.toString()} value={stat.status_id?.toString()}>
                    {stat.status_name}
                  </option>
                ))}
              </select>
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Gestionado desde el inventario de stock</small>
            </div>

            <div>
              <label className="form-label">Cantidad en Stock (Disponibles)</label>
              <input 
                name="stock_quantity" 
                type="number" 
                min="0"
                className="form-input form-input-disabled" 
                value={formData.stock_quantity ?? ''} 
                disabled 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Gestionado desde el inventario de stock</small>
            </div>

            <div>
              <label className="form-label">Peso (Kg)</label>
              <input 
                name="weight_kg" 
                type="number" 
                min="0"
                step="0.01"
                className="form-input" 
                value={formData.weight_kg ?? ''} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label className="form-label">Precio de Venta ($) *</label>
              <input 
                name="sale_price" 
                type="text" 
                className="form-input" 
                value={formData.sale_price ?? ''} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="form-label">Precio Alquiler Diario ($) *</label>
              <input 
                name="daily_rental_price" 
                type="text" 
                className="form-input" 
                value={formData.daily_rental_price ?? ''} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="form-label">Próxima Revisión Técnica</label>
              <input 
                name="next_revision_date" 
                type="date" 
                className="form-input form-input-disabled" 
                value={formData.next_revision_date || ''} 
                disabled 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Gestionado desde el inventario de stock</small>
            </div>

            <div className="checkbox-field-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <input 
                name="is_motorized" 
                type="checkbox" 
                id="is_motorized"
                checked={!!formData.is_motorized} 
                onChange={handleChange} 
              />
              <label htmlFor="is_motorized" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>¿Es Motorizado?</label>
            </div>

            <div className="checkbox-field-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <input 
                name="is_owned" 
                type="checkbox" 
                id="is_owned"
                checked={formData.is_owned ?? true} 
                disabled 
              />
              <label htmlFor="is_owned" className="form-label" style={{ margin: 0, cursor: 'not-allowed', opacity: 0.7 }}>¿Es Propiedad de la Empresa?</label>
              <small style={{ color: '#6b7280', fontSize: '12px', marginLeft: '8px' }}>Gestionado desde el inventario de stock</small>
            </div>

            <div className="form-full-width">
              <label className="form-label">Descripción o Especificaciones</label>
              <textarea 
                name="machinery_description" 
                rows="3" 
                className="form-input" 
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                value={formData.machinery_description || ''} 
                onChange={handleChange} 
              />
            </div>

          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Maquinaria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineryForm;