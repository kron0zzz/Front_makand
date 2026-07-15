import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
      page: 1,
      totalPages: 1,
      total: 0
  });


  const cargarRoles = useCallback(async () => {
    try{
      const datos = await roleService.obtenerTodos(page, limit, search);
      setRoles(datos.data);
      setPagination(datos.pagination);
    }catch (err){
      setError(err.message || 'Error al cargar categorías');
    }
  }, [page, limit, search]);




  //función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    if (
        nuevaPagina !== page &&
        nuevaPagina >= 1 &&
        nuevaPagina <= pagination.totalPages
    ) {
        setPage(nuevaPagina);
    }
  };



  const cambiarBusqueda = useCallback((texto) => {
    setSearch(texto);
    setPage(1);
  }, []);


  const eliminarRol = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este rol?')) {
      const exito = await roleService.eliminar(id);
      if (exito) cargarRoles();
    }
  };

  return { 
    roles, 
    cargarRoles, 
    eliminarRol,
  
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination
  };
};