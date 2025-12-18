// src/services/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

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
      }
      
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      return headers;
    },
    // Configurar timeout e credenciais
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
  
  // Endpoints serão injetados pelas APIs específicas
  endpoints: () => ({}),
});

// Helper para extrair mensagens de erro
export const extractErrorMessage = (error: any): string => {
  if (error.data) {
    if (typeof error.data === 'string') return error.data;
    if (error.data.detail) return error.data.detail;
    if (error.data.message) return error.data.message;
    if (error.data.error) return error.data.error;
    
    // Erros de validação
    const firstKey = Object.keys(error.data)[0];
    if (Array.isArray(error.data[firstKey])) {
      return error.data[firstKey][0];
    }
  }
  
  return error.message || 'Erro desconhecido';
};