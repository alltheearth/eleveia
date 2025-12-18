// src/api/client.ts
import axios, {type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ==========================================
// CONFIGURAÇÃO BASE
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ==========================================
// INSTÂNCIA DO AXIOS
// ==========================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// INTERCEPTOR DE REQUEST
// ==========================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adicionar token se existir
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR DE RESPONSE
// ==========================================

apiClient.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('📥 Response:', response.status, response.config.url);
    }

    return response;
  },
  async (error: AxiosError) => {
    // Log de erro
    if (import.meta.env.DEV) {
      console.error('❌ Error:', error.response?.status, error.config?.url);
    }

    // Tratar erros específicos
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Token inválido ou expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;

        case 403:
          // Sem permissão
          console.error('Sem permissão para acessar este recurso');
          break;

        case 404:
          // Recurso não encontrado
          console.error('Recurso não encontrado');
          break;

        case 500:
          // Erro no servidor
          console.error('Erro no servidor. Tente novamente mais tarde.');
          break;
      }
    } else if (error.request) {
      // Requisição enviada mas sem resposta
      console.error('Sem resposta do servidor. Verifique sua conexão.');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Define o token de autenticação
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

/**
 * Remove o token de autenticação
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Obtém dados do usuário armazenados
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Armazena dados do usuário
 */
export const setStoredUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// ==========================================
// TIPOS DE ERRO
// ==========================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Extrai mensagem de erro da resposta
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;

    // Erro com campo específico
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (data.detail) return data.detail;

    // Erros de validação
    if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      if (Array.isArray(data[firstKey])) {
        return data[firstKey][0];
      }
      return data[firstKey];
    }
  }

  return error.message || 'Erro desconhecido';
};

export default apiClient;