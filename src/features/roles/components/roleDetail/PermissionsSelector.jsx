import { useState, useEffect } from 'react';
import { apiClient } from "../../../../shared/services/api";

const PermissionsSelector = ({ selected = [], onChange, isEditable = true }) => {
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

    const newSelection = selected.includes(id) 
      ? selected.filter(i => i !== id) 
      : [...selected, id];
    
    onChange(newSelection);
  };

  if (loading) return <div>Cargando permisos...</div>;

  //(Vista de Detalle): lista con viñetas
  if (!isEditable) {
    const assignedPermissions = allPermissions.filter(p => selected.includes(p.id));

    if (assignedPermissions.length === 0) {
      return <p className="text-gray-500 italic">No tiene permisos asignados.</p>;
    }

    return (
      <ul className="permissions-bullet-list" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
        {assignedPermissions.map(p => (
          <li key={p.id} style={{ marginBottom: '6px', color: '#374151' }}>
            {p.name}
          </li>
        ))}
      </ul>
    );
  }

  // (Crear / Editar) con checkboxes
  return (
    <div className="permissions-grid">
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