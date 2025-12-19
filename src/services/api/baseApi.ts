// src/services/api/baseApi.ts - ✅ CORRIGIDA
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Configuração base do RTK Query para toda a aplicação
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // ✅ CRÍTICO: Pegar token do estado E do localStorage
      const state = getState() as RootState;
      
      // Tentar pegar do estado primeiro
      let token = state.auth.token;
      
      // Se não tiver no estado, tentar localStorage
      if (!token) {
        token = localStorage.getItem('eleve_token');
        console.log('🔍 [API] Token não estava no state, buscando do localStorage');
      }
      
      // ✅ Sempre logar o token (preview)
      if (token) {
        console.log('🔑 [API] Token encontrado:', token.substring(0, 20) + '...');
        headers.set('Authorization', `Token ${token}`);
      } else {
        console.warn('⚠️ [API] Nenhum token encontrado');
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