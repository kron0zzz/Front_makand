import { useState, useEffect } from 'react';
import { apiClient } from "../../../../shared/services/api";

const PermissionsSelector = ({ roleId, isEditable = true }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, currentRes] = await Promise.all([
          apiClient.get('/roles/permissions/list'),
          apiClient.get(`/roles/${roleId}/permissions`)
        ]);
        setAllPermissions(allRes.data);
        setSelected(currentRes.data.map(p => p.id));
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    };
    if (roleId) fetchData();
  }, [roleId]);

  const toggle = async (id) => {
    const isAdding = !selected.includes(id);
    const newSelection = isAdding ? [...selected, id] : selected.filter(i => i !== id);
    
    // Actualizamos estado local inmediatamente para que el checkbox responda rápido
    setSelected(newSelection);

    // Guardamos en el backend
    try {
      await apiClient.put(`/roles/${roleId}/permissions`, { permissions: newSelection });
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      // Revertimos si falla
      setSelected(selected); 
    }
  };

  if (loading) return <div>Cargando permisos...</div>;

  if (!isEditable) {
    return (
      <div className="permissions-view">
        {allPermissions.filter(p => selected.includes(p.id)).map(p => (
          <span key={p.id} className="permission-badge">{p.name}</span>
        ))}
        {selected.length === 0 && <p>No tiene permisos asignados.</p>}
      </div>
    );
  }

  return (
    <div className="permissions-grid">
      {allPermissions.map(p => (
        <label key={p.id} className="permission-item">
          <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
          {p.name}
        </label>
      ))}
    </div>
  );
};

export default PermissionsSelector;

