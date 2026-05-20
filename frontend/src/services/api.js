import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export const materialsAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  recordMovement: (id, data) => api.post(`/materials/${id}/movement`, data),
  getLowStock: () => api.get('/materials/low-stock'),
  getStats: () => api.get('/materials/stats'),
};

export const hrmsAPI = {
  getEmployees: (params) => api.get('/hrms/employees', { params }),
  getEmployeeById: (id) => api.get(`/hrms/employees/${id}`),
  createEmployee: (data) => api.post('/hrms/employees', data),
  updateEmployee: (id, data) => api.put(`/hrms/employees/${id}`, data),
  getAttendance: (params) => api.get('/hrms/attendance', { params }),
  markAttendance: (data) => api.post('/hrms/attendance', data),
  getLeaves: (params) => api.get('/hrms/leaves', { params }),
  createLeave: (data) => api.post('/hrms/leaves', data),
  updateLeave: (id, data) => api.put(`/hrms/leaves/${id}`, data),
  getStats: () => api.get('/hrms/stats'),
};

export const erpAPI = {
  getVendors: (params) => api.get('/erp/vendors', { params }),
  getVendorById: (id) => api.get(`/erp/vendors/${id}`),
  createVendor: (data) => api.post('/erp/vendors', data),
  updateVendor: (id, data) => api.put(`/erp/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/erp/vendors/${id}`),
  getPurchaseOrders: (params) => api.get('/erp/purchase-orders', { params }),
  createPurchaseOrder: (data) => api.post('/erp/purchase-orders', data),
  updatePurchaseOrder: (id, data) => api.put(`/erp/purchase-orders/${id}`, data),
  getStats: () => api.get('/erp/stats'),
};

export const crmAPI = {
  getCustomers: (params) => api.get('/crm/customers', { params }),
  getCustomerById: (id) => api.get(`/crm/customers/${id}`),
  createCustomer: (data) => api.post('/crm/customers', data),
  updateCustomer: (id, data) => api.put(`/crm/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/crm/customers/${id}`),
  getLeads: (params) => api.get('/crm/leads', { params }),
  createLead: (data) => api.post('/crm/leads', data),
  updateLead: (id, data) => api.put(`/crm/leads/${id}`, data),
  getPipeline: () => api.get('/crm/pipeline'),
  getStats: () => api.get('/crm/stats'),
};

export default api;
