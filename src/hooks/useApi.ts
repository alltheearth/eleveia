// src/services/api/baseApi.ts - ✅ VERSÃO CORRIGIDA FINAL
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * ✅ API BASE - ÚNICA FONTE DE VERDADE
 * 
 * Todos os endpoints devem injetar aqui usando .injectEndpoints()
 * Headers são configurados automaticamente
 */
export const baseApi = createApi({
  reducerPath: 'api',
  
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      
      // 🔑 PRIORIDADE: State -> localStorage
      let token = state.auth.token;
      
      if (!token) {
        token = localStorage.getItem('eleve_token');
      }
      
      // ✅ Adicionar token se existir
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      
      // ✅ Headers padrão
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      return headers;
    },
    
    timeout: 30000,
  }),
  
  // 🏷️ Tags para cache invalidation
  tagTypes: [
    'Auth',
    'School', 
    'Contact', 
    'Lead', 
    'Event', 
    'FAQ', 
    'Ticket',
    'Dashboard',
    'Document',
    'Messaging', // ✅ NOVO
  ],
  
  endpoints: () => ({}), // Endpoints injetados pelas APIs específicas
});

/**
 * ✅ Helper para extrair mensagens de erro
 */
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