import { X } from 'lucide-react';
import { usePositions } from "../../hooks/usePositions";
import './PositionForm.css';
//import React, { useEffect, useState } from 'react';

const PositionForm = ({ isOpen, onClose, formData, setFormData, isEditing }) => {
  const { cargarCargos } = usePositions();



  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      position_name: formData.position_name
    };

    const url = isEditing 
      ? `http://localhost:3000/api/positions/${formData.position_id}` 
      : 'http://localhost:3000/api/positions';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert(isEditing ? '¡Cargo actualizado con éxito!' : '¡Cargo creado con éxito!');
        await cargarCargos();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error del servidor: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión: Asegúrate de que el servidor de Makand esté corriendo.");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-container">
        
        {/* Header del Modal */}
        <div className="form-header">
          <h2>
            {isEditing ? 'Editar Información del Cargo' : 'Registrar Nuevo Cargo'}
          </h2>
          <button onClick={onClose} className="form-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">
            
            {/* ID del Cliente (Solo lectura) */}
            <div>
              <label className="form-label">Código Interno</label>
              <input 
                type="text" 
                className="form-input form-input-disabled"
                value={isEditing ? `ID: ${formData.position_id}` : 'Asignado automáticamente'} 
                disabled 
              />
            </div>


            {/* Nombre Cargo */}
            <div>
              <label className="form-label">Nombre del cargo*</label>
              <input name="position_name" type="text" className="form-input" value={formData.position_name || ''} onChange={handleChange} required />
            </div>

            

          </div>

          {/* Botones de Acción */}
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Guardar Cambios' : 'Registrar Cargo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionForm;