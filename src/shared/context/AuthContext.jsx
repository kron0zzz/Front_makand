// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Inicializamos el estado leyendo del localStorage
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   // Función para verificar si tiene permiso
//   const hasPermission = (permissionName) => {
//     return user?.permissions?.includes(permissionName);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializamos el estado leyendo del localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Función mejorada para verificar si tiene permiso
  const hasPermission = (permissionName) => {
    // 1. Acceso total para Administrador (asumiendo role_id: 1)
    if (user?.role_id === 1) return true;

    // 2. Si no hay permisos definidos, denegar
    if (!user?.permissions || !Array.isArray(user.permissions)) return false;

    // 3. Buscar en el array. Se adapta si son strings o objetos con 'permission_name'
    return user.permissions.some((p) => {
      if (typeof p === "string") {
        return p === permissionName;
      }
      // Ajusta 'permission_name' si tu base de datos usa otro nombre (ej: 'name', 'slug')
      return p.permission_name === permissionName;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);