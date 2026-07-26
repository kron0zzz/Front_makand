import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';
import { useAlertModal } from "../../../shared/alertModal";

// import { useState, useCallback } from 'react';
// import { roleService } from '../services/roleService';

// export const useRoles = () => {
//   const [roles, setRoles] = useState([]);

//   const [page, setPage] = useState(1);
//   const [limit] = useState(9);
//   const [search, setSearch] = useState("");

//   const [pagination, setPagination] = useState({
//       page: 1,
//       totalPages: 1,
//       total: 0
//   });


//   const cargarRoles = useCallback(async () => {
//     try{
//       const datos = await roleService.obtenerTodos(page, limit, search);
//       setRoles(datos.data);
//       setPagination(datos.pagination);
//     }catch (err){
//       setError(err.message || 'Error al cargar categorías');
//     }
//   }, [page, limit, search]);




//   //función para cambiar de página
//   const cambiarPagina = (nuevaPagina) => {
//     if (
//         nuevaPagina !== page &&
//         nuevaPagina >= 1 &&
//         nuevaPagina <= pagination.totalPages
//     ) {
//         setPage(nuevaPagina);
//     }
//   };



//   const cambiarBusqueda = useCallback((texto) => {
//     setSearch(texto);
//     setPage(1);
//   }, []);


//   const eliminarRol = async (id) => {
//     if (window.confirm('¿Seguro que deseas eliminar este rol?')) {
//       const exito = await roleService.eliminar(id);
//       if (exito) cargarRoles();
//     }
//   };

//   return { 
//     roles, 
//     cargarRoles, 
//     eliminarRol,
  
//     page,
//     cambiarPagina,
//     cambiarBusqueda,
//     pagination
//   };
// };


export const useRoles = () => {
  const { showAlert, showConfirm } = useAlertModal();
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null); 
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
      setError(err.message || 'Error al cargar roles');
    }
  }, [page, limit, search]);

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
    if (await showConfirm('¿Seguro que deseas eliminar este rol?')) {
      const exito = await roleService.eliminar(id);
      if (exito) cargarRoles();
    }
  };

  // FUNCIÓN PARA EL SWITCH DE ESTADO
  const toggleRolEstado = async (rol) => {
    const nuevoEstado = !rol.role_status;
    const accionTexto = nuevoEstado ? "activar" : "desactivar";

    if (await showConfirm(`¿Estás seguro de que deseas ${accionTexto} este rol?`)) {
      try {
        await roleService.actualizar(rol.role_id, { 
          role_name: rol.role_name, 
          role_status: nuevoEstado 
        });
        
        cargarRoles();
        await showAlert("Estado del rol actualizado correctamente.");
      } catch (err) {
        console.error("Error al cambiar estado del rol:", err);
        await showAlert("No se pudo cambiar el estado del rol. Verifica que tengas permisos de edición.");
      }
    }
  };

  return { 
    roles, 
    cargarRoles, 
    eliminarRol,
    toggleRolEstado, 
    page,
    cambiarPagina,
    cambiarBusqueda,
    pagination,
    error
  };
};