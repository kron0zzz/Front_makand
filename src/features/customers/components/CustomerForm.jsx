// El formulario para crear/editar


import React from 'react';
import { X } from 'lucide-react';

const CustomerForm = ({ isOpen, onClose, onSave, formData, setFormData, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{fontSize: '20px', fontWeight: '600'}}>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="form-group">
            <label>Nombres</label>
            <input 
              className="form-input"
              placeholder="Ej. Juan Andrés" 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input 
              className="form-input"
              placeholder="Ej. Pérez" 
              value={formData.lastName || ''} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label>Documento de Identidad</label>
            <input 
              className="form-input"
              placeholder="Número de documento" 
              value={formData.documento} 
              onChange={(e) => setFormData({...formData, documento: e.target.value})}
              required 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;