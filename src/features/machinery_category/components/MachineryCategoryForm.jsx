import { X } from 'lucide-react';
import { useMachineryCategories } from "../hooks/useMachineryCategories";
import './MachineryCategoryForm.css'
import { useAlertModal } from "../../../shared/alertModal";

const MachineryCategoryForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { showAlert, showConfirm } = useAlertModal();
  const { cargarCategorias } = useMachineryCategories();

  if (!isOpen) return null;

  const sanitizeCategoryName = (value) => {
    return value
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s{2,}/g, ' ');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valor = value;
    if (name === 'categoryName') {
      valor = sanitizeCategoryName(value);
    }
    setFormData({ ...formData, [name]: valor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      category_name: formData.categoryName
    };

    const url = isEditing 
      ? `https://api-makand.onrender.com/api/machine-categories/${formData.category_id}` 
      : 'https://api-makand.onrender.com/api/machine-categories';
    
    const method = isEditing ? 'PUT' : 'POST';
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await showAlert(isEditing ? '¡Categoría actualizada con éxito!' : '¡Categoría creada con éxito!');
        await cargarCategorias();
        onClose();
      } else {
        const errorData = await response.json();
        await showAlert(`Error: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      await showAlert("Error de conexión con el servidor de Makand.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Categoría de Maquinaria' : 'Registrar Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
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
                value={isEditing ? `ID: ${formData.category_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>

            <div>
              <label className="form-label">Nombre de la Categoría *</label>
              <input 
                name="categoryName" 
                type="text" 
                className="form-input" 
                placeholder="Ej: Pesada, Agrícola, Elevación..."
                value={formData.categoryName || ''} 
                onChange={handleChange} 
                required 
              />
            </div>

          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineryCategoryForm;
