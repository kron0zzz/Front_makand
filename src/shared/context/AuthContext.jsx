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
    // Limpieza total
    localStorage.clear(); 
    window.location.href = "/login"; // Redirección forzada
  };

  const hasPermission = (permissionName) => {
    // 1. Acceso total para Administrador (role_id: 1)
    if (user?.role_id === 1) return true;

    // 2. Si no hay usuario o no tiene permisos, denegar
    if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;

    // 3. Verificamos si el permiso está en el array
    // Ajustado para comparar directamente el string del permiso
    return user.permissions.includes(permissionName);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);