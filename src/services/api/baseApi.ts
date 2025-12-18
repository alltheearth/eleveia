// src/services/api/baseApi.ts - ✅ CORRIGIDO
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

/**
 * Configuração base do RTK Query para toda a aplicação
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // ✅ Pegar token do estado Redux OU localStorage
      const state = getState() as RootState;
      let token = state.auth.token;
      
      // ✅ Fallback para localStorage se não tiver no state
      if (!token) {
        token = localStorage.getItem('eleve_token');
      }
      
      if (token) {
        headers.set('Authorization', `Token ${token}`);
        console.log('✅ Token adicionado ao header:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ Nenhum token encontrado');
      }
      
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      return headers;
    },
    timeout: 30000,
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
  
  endpoints: () => ({}),
});

// Helper para extrair mensagens de erro
export const extractErrorMessage = (error: any): string => {
  console.error('📋 Extraindo erro:', error);
  
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
    
    // Se tiver non_field_errors
    if (error.data.non_field_errors && Array.isArray(error.data.non_field_errors)) {
      return error.data.non_field_errors[0];
    }
  }
  
  if (error.error) {
    return error.error;
  }
  
  return error.message || 'Erro desconhecido';
};