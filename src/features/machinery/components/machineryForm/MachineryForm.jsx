import { X } from 'lucide-react';
import { useMachinery } from "../../hooks/useMachinery";
import './MachineryForm.css'; 

// 🌟 RECIBIMOS categories Y statuses AQUÍ EN LAS PROPS
const MachineryForm = ({ isOpen, onClose, formData, setFormData, isEditing, categories = [], statuses = [] }) => {
  // Consumimos solo las funciones de acción del hook maestro
  const { crearMaquinaria, actualizarMaquinaria } = useMachinery();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      status_id: parseInt(formData.status_id),
      category_id: parseInt(formData.category_id),
      machinery_name: formData.machinery_name,
      machinery_description: formData.machinery_description || '',
      sale_price: parseFloat(formData.sale_price),
      daily_rental_price: parseFloat(formData.daily_rental_price),
      stock_quantity: parseInt(formData.stock_quantity),
      next_revision_date: formData.next_revision_date || null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      is_motorized: !!formData.is_motorized,
      is_owned: !!formData.is_owned
    };

    // 🌟 CORREGIDO: Usamos un ternario directo para evitar el aviso de reasignación del linter
    const exito = isEditing 
      ? await actualizarMaquinaria(formData.machinery_id, dataToSend)
      : await crearMaquinaria(dataToSend);

    if (exito) {
      alert(isEditing ? '¡Maquinaria actualizada con éxito!' : '¡Maquinaria registrada con éxito!');
      onClose(); 
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

            {/* Selector de Categoría */}
            <div>
              <label className="form-label">Categoría *</label>
              <select 
                name="category_id" 
                className="form-input"
                value={formData.category_id || ''} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((cat) => {
                  const id = cat.category_id || cat.machinery_category_id;
                  const name = cat.category_name || cat.machinery_category_name;

                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selector de Estado */}
            <div>
              <label className="form-label">Estado de la Máquina *</label>
              <select 
                name="status_id" 
                className="form-input"
                value={formData.status_id || ''} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {statuses.map((stat) => (
                  <option key={stat.status_id} value={stat.status_id}>
                    {stat.status_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Cantidad en Stock (Disponibles) *</label>
              <input 
                name="stock_quantity" 
                type="number" 
                min="0"
                className="form-input" 
                value={formData.stock_quantity ?? ''} 
                onChange={handleChange} 
                required 
              />
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
                type="number" 
                min="0"
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
                type="number" 
                min="0"
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
                className="form-input" 
                value={formData.next_revision_date || ''} 
                onChange={handleChange} 
              />
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
                onChange={handleChange} 
              />
              <label htmlFor="is_owned" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>¿Es Propiedad de la Empresa?</label>
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