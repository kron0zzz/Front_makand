import { useState } from 'react';

const Vehiculo = ({ vehiculo, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState(() => ({
    placa: isEditing && vehiculo ? vehiculo.placa || '' : '',
    marca: isEditing && vehiculo ? vehiculo.marca || '' : '',
    modelo: isEditing && vehiculo ? vehiculo.modelo || '' : '',
    capacidadKg: isEditing && vehiculo ? vehiculo.capacidadKg || '' : '',
    estado: isEditing && vehiculo ? vehiculo.estado === 'Activo' : true,
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="vehiculo-form grid grid-cols-2 gap-4">
      <div className="form-group">
        <label>Marca *</label>
        <input
          type="text"
          name="marca"
          placeholder="Ej: Toyota"
          value={formData.marca}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Modelo *</label>
        <input
          type="text"
          name="modelo"
          placeholder="Ej: Hilux 2022"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Placa *</label>
        <input
          type="text"
          name="placa"
          placeholder="Ej: ABC-123"
          value={formData.placa}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Capacidad (kg) *</label>
        <input
          type="number"
          name="capacidadKg"
          placeholder="Ej: 1000"
          value={formData.capacidadKg}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group form-full">
        <label>
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleChange}
          />
          Activo
        </label>
      </div>
      <div className="modal-actions form-full">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default Vehiculo;