// src/services/employeeService.js
const API_URL = 'http://localhost:3000/api/employees';

export const employeeService = {
  obtenerTodos: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/table`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok ? await response.json() : [];
  },

  obtenerPorId: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok ? await response.json() : null;
  },

  crear: async (data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response;
  },

  actualizar: async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response;
  },

  eliminar: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
  }
};