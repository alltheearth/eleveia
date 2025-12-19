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
  escola_id?: number;
  tipo_perfil?: 'gestor' | 'operador';
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
      transformResponse: (response: AuthResponse) => {
        // ✅ CRÍTICO: Salvar token no localStorage
        console.log('🔑 [AUTH API] Salvando token no localStorage...');
        localStorage.setItem('eleve_token', response.token);
        console.log('💾 [AUTH API] Token salvo:', response.token.substring(0, 20) + '...');
        return response;
      },
    }),
    
    // Registro
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/registro/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('eleve_token', response.token);
        console.log('✅ Registro bem-sucedido');
        return response;
      },
    }),
    
    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem('eleve_token');
          console.log('✅ Logout bem-sucedido');
        } catch {
          // Mesmo com erro, remover token
          localStorage.removeItem('eleve_token');
        }
      },
    }),
    
    // Obter perfil do usuário - ✅ ROTA CORRETA
    getProfile: builder.query<User, void>({
      query: () => {
        console.log('🔍 [AUTH API] Buscando perfil em /auth/perfil/');
        return '/auth/perfil/';
      },
      providesTags: ['Auth'],
      transformResponse: (response: User) => {
        console.log('✅ [AUTH API] Perfil recebido:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('❌ [AUTH API] Erro ao buscar perfil:', error);
        
        // Se for 401, limpar token
        if (error.status === 401) {
          console.log('🧹 [AUTH API] Token inválido - Limpando localStorage');
          localStorage.removeItem('eleve_token');
        }
        
        return error;
      },
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