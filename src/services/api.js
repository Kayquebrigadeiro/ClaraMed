import axios from 'axios';

/**
 * Instância do Axios pré-configurada para comunicação com o backend ClaraMed.
 * Prompt 2: Interceptor de response para 401 com logout automático.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: injeta token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('claramed_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: logout automático em 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('claramed_token');
      localStorage.removeItem('claramed_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
