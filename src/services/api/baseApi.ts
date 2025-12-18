// ✅ CORRETO - src/services/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

// ✅ URL base CORRETA (inclui /api/v1)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🌐 API Base URL:', API_BASE_URL);

/**
 * Configuração base do RTK Query para toda a aplicação
 * Todas as APIs devem injetar endpoints nesta base
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Pegar token do estado ou localStorage
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem('eleve_token');
      
      if (token) {
        headers.set('Authorization', `Token ${token}`);
        console.log('🔑 Token adicionado ao header');
      }
      
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      return headers;
    },
  }),
  
  // Tags para invalidação de cache
  tagTypes: [
    'Auth',
    'School', 
    'Contact', 
    'Lead', 
    'Event', 
    'FAQ', 
    'Ticket',
    'Dashboard',
    'Document'
  ],
  
  // Endpoints serão injetados pelas APIs específicas
  endpoints: () => ({}),
});

// Helper para extrair mensagens de erro
export const extractErrorMessage = (error: any): string => {
  console.error('🔴 Erro da API:', error);
  
  if (error.data) {
    if (typeof error.data === 'string') return error.data;
    if (error.data.detail) return error.data.detail;
    if (error.data.message) return error.data.message;
    if (error.data.error) return error.data.error;
    
    // Erros de validação
    const firstKey = Object.keys(error.data)[0];
    if (firstKey && Array.isArray(error.data[firstKey])) {
      return error.data[firstKey][0];
    }
  }
  
  if (error.status === 404) {
    return 'Endpoint não encontrado. Verifique se a API está rodando.';
  }
  
  if (error.status === 401) {
    return 'Não autorizado. Faça login novamente.';
  }
  
  if (error.status === 403) {
    return 'Acesso negado. Você não tem permissão.';
  }
  
  if (error.status === 500) {
    return 'Erro no servidor. Tente novamente mais tarde.';
  }
  
  return error.message || error.error || 'Erro desconhecido';
};