// src/services/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface RefreshResponse {
  access: string;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_KEY = 'access_token';

// Mutex para evitar múltiplas chamadas de refresh simultâneas
const mutex = new Mutex();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extrai mensagem de erro de forma consistente
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  const errorData = error?.data as ErrorResponse;
  
  if (errorData?.detail) return errorData.detail;
  if (errorData?.message) return errorData.message;
  if (errorData?.error) return errorData.error;
  if (errorData?.non_field_errors?.[0]) return errorData.non_field_errors[0];
  
  // Extrai primeira mensagem de erro de campo específico
  const fieldErrors = Object.entries(errorData || {})
    .filter(([key]) => !['detail', 'message', 'error', 'non_field_errors'].includes(key))
    .map(([_, value]) => {
      if (Array.isArray(value)) return value[0];
      return value;
    })
    .filter(Boolean);
  
  if (fieldErrors.length > 0) return fieldErrors[0] as string;
  
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Gerencia tokens no localStorage
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
};

// ============================================================================
// BASE QUERY CONFIGURATION
// ============================================================================

/**
 * Base query inicial com configurações básicas
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = tokenManager.getAccessToken();
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Headers adicionais
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

/**
 * Base query com retry logic e refresh token
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Aguarda se houver um refresh em andamento
  await mutex.waitForUnlock();
  
  // Primeira tentativa
  let result = await baseQuery(args, api, extraOptions);
  
  // Se retornou 401 (não autorizado)
  if (result.error && result.error.status === 401) {
    // Verifica se já não está fazendo refresh
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          // Sem refresh token, desloga o usuário
          tokenManager.clearTokens();
          window.location.href = '/login';
          return result;
        }
        
        // Tenta fazer refresh do token
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh/',
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );
        
        if (refreshResult.data) {
          const { access } = refreshResult.data as RefreshResponse;
          
          // Salva novo access token
          tokenManager.setAccessToken(access);
          
          // Tenta novamente a requisição original
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh falhou, desloga
          tokenManager.clearTokens();
          window.location.href = '/login';
        }
      } finally {
        release();
      }
    } else {
      // Aguarda o refresh terminar e tenta novamente
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  
  // Logging em desenvolvimento
  if (import.meta.env.DEV) {
    const endpoint = typeof args === 'string' ? args : args.url;
    
    if (result.error) {
      console.error(`❌ API Error [${endpoint}]:`, result.error);
    } else {
      console.log(`✅ API Success [${endpoint}]`);
    }
  }
  
  return result;
};

// ============================================================================
// API SLICE
// ============================================================================

/**
 * API Slice principal - Base para todos os endpoints da aplicação
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  
  // Tags para invalidação de cache
  tagTypes: [
    // Auth & User
    'Auth',
    'User',
    'Profile',
    
    // School Management
    'Schools',
    'SchoolConfig',
    
    // Leads & CRM
    'Leads',
    'LeadActivities',
    'LeadNotes',
    
    // Campaigns
    'Campaigns',
    'CampaignAnalytics',
    'Templates',
    'MessageTemplates',
    
    // Calendar & Events
    'Events',
    'Appointments',
    'Meetings',
    
    // Communication
    'Messages',
    'Notifications',
    'WhatsAppMessages',
    'EmailMessages',
    'SMSMessages',
    
    // Students & Enrollments
    'Students',
    'Enrollments',
    'Classes',
    'Courses',
    
    // Parents & Guardians
    'Parents',
    'Guardians',
    
    // Financial
    'Payments',
    'Invoices',
    'PaymentPlans',
    
    // Content
    'FAQs',
    'Documents',
    'Files',
    
    // Analytics & Reports
    'Analytics',
    'Reports',
    'Dashboards',
    
    // Settings
    'Settings',
    'Permissions',
  ],
  
  // Endpoints vazios - serão injetados pelos arquivos de service específicos
  endpoints: () => ({}),
});

// ============================================================================
// HOOKS PARA RESET
// ============================================================================

/**
 * Hook para resetar toda a API (útil no logout)
 */
export const useResetApi = () => {
  const dispatch = apiSlice.util.resetApiState();
  
  return () => {
    dispatch;
    tokenManager.clearTokens();
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export const { 
  middleware: apiMiddleware,
  reducer: apiReducer,
  reducerPath: apiReducerPath,
  util: apiUtil,
} = apiSlice;

// Export hooks automáticos do RTK Query
// Nota: Hooks específicos serão exportados pelos arquivos de service
export default apiSlice;