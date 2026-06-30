import { useState, useCallback } from 'react';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:3000/api/suppliers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const datos = await response.json();
      setSuppliers(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleProveedorEstado = async (id, estadoActual, proveedorCompleto) => {
    // 1. Advertencia de confirmación antes de proceder
    const mensaje = `¿Estás seguro de que deseas ${estadoActual ? 'desactivar' : 'activar'} este proveedor?`;
    if (!window.confirm(mensaje)) {
      return; // Si el usuario cancela, salimos de la función
    }

    try {
      const token = localStorage.getItem("token");
      
      const datosParaEnviar = {
        ...proveedorCompleto,
        supplier_status: !estadoActual
      };

      const response = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(datosParaEnviar)
      });

      if (response.ok) {
        setSuppliers(prev => prev.map(s => 
          s.supplier_id === id ? { ...s, supplier_status: !estadoActual } : s
        ));
      } else {
        alert("No se pudo actualizar el estado.");
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setSuppliers(prev => prev.filter(s => s.supplier_id !== id));
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  return { suppliers, loading, error, cargarProveedores, toggleProveedorEstado, eliminarProveedor, setSuppliers };
};