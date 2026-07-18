import { useState, useEffect } from 'react';
import { apiClient } from "../../../../shared/services/api";

const PermissionsSelector = ({ selected, onChange, isEditable = true }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPermissions = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('roles/permissions/list');
        setAllPermissions(res.data);
      } catch (error) {
        console.error("Error al cargar lista de permisos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPermissions();
  }, []);

  const handleToggle = (id) => {
    if (!isEditable) return;

    // Calculamos el nuevo array de permisos
    const newSelection = selected.includes(id) 
      ? selected.filter(i => i !== id) 
      : [...selected, id];
    
    // Notificamos al formulario padre
    onChange(newSelection);
  };

  if (loading) return <div>Cargando permisos...</div>;

  return (
    <div className={`permissions-grid ${!isEditable ? 'view-only' : ''}`}>
      {allPermissions.map(p => (
        <label key={p.id} className="permission-item">
          <input 
            type="checkbox" 
            checked={selected.includes(p.id)} 
            onChange={() => handleToggle(p.id)} 
            disabled={!isEditable}
          />
          {p.name}
        </label>
      ))}
    </div>
  );
};

export default PermissionsSelector;