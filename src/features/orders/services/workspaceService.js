
import { apiClient } from "../../../shared/services/api";

//--------------------------
// Workspace
//--------------------------
export const getWorkspace = async (orderId) => {
    // Ya no necesitas 'http://localhost:3000/api', apiClient lo hace por ti
    const { data } = await apiClient.get(`/orders/${orderId}/workspace`);
    return data;
};

export const closeOrder = async (orderId) => {
    const { data: response } = await apiClient.put(`/orders/${orderId}/close`);
    return response;
};

//--------------------------
// Returns
//--------------------------
export const createReturn = async (data) => {
    const { data: response } = await apiClient.post('/returns', data);
    return response;
};

export const updateReturn = async (returnId, data) => {
    const { data: response } = await apiClient.put(`/returns/${returnId}`, data);
    return response;
};

export const deleteReturn = async (returnId) => {
    const { data } = await apiClient.delete(`/returns/${returnId}`);
    return data;
};

//--------------------------
// Cuts
//--------------------------
export const createCut = async (data) => {
    const { data: response } = await apiClient.post('/rental-cuts', data);
    return response;
};

export const getCutsByOrder = async (orderId) => {
    const { data } = await apiClient.get(`/rental-cuts/order/${orderId}`);
    return data;
};


//--------------------------
// Payments
//--------------------------

export const getPaymentsByOrder = async (orderId) => {
    const {data} = await apiClient.get(`/payments/order/${orderId}`);
    return data;
}

export const createPayment = async (data) => {
    const {data:response} = await apiClient.post(`/payments`, data);
    return response;
}