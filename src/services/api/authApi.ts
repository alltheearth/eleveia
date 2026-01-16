// src/services/api/authApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  perfil?: {
    id: number;
    escola: number;
    escola_nome: string;
    tipo: 'gestor' | 'operador';
    tipo_display: string;
    ativo: boolean;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// ============================================
// API
// ============================================

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Registro
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/registro/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Obter perfil
    getProfile: builder.query<User, void>({
      query: () => '/auth/perfil/',
      providesTags: ['Auth'],
    }),
    
    // Atualizar perfil
    updateProfile: builder.mutation<{ message: string; user: User }, Partial<User>>({
      query: (data) => ({
        url: '/auth/atualizar-perfil/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;