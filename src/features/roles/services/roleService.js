const API_URL = 'http://localhost:3000/api/roles';

export const roleService = {
  obtenerTodos: async (page = 1, limit = 9, search="") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/table?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok ? await response.json() : [];
  },
  crear: async (data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return response.ok;
  },
  actualizar: async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return response.ok;
  },
  eliminar: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  }
};