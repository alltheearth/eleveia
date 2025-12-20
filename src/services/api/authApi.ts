// src/services/api/authApi.ts - ✅ COMPLETO E CORRIGIDO
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
      query: (credentials) => {
        console.log('🔐 [AUTH API] Fazendo login...', credentials.username);
        return {
          url: '/auth/login/',
          method: 'POST',
          body: credentials,
        };
      },
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        console.log('✅ [AUTH API] Login bem-sucedido, resposta:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ [AUTH API] Erro no login:', response);
        return response;
      },
    }),
    
    // Registro
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        console.log('📝 [AUTH API] Registrando usuário...', userData.username);
        return {
          url: '/auth/registro/',
          method: 'POST',
          body: userData,
        };
      },
      invalidatesTags: ['Auth'],
      transformResponse: (response: AuthResponse) => {
        console.log('✅ [AUTH API] Registro bem-sucedido');
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ [AUTH API] Erro no registro:', response);
        return response;
      },
    }),
    
    // Logout
    logout: builder.mutation<void, void>({
      query: () => {
        console.log('👋 [AUTH API] Fazendo logout...');
        return {
          url: '/auth/logout/',
          method: 'POST',
        };
      },
      invalidatesTags: ['Auth'],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem('eleve_token');
          console.log('✅ [AUTH API] Logout bem-sucedido');
        } catch {
          // Mesmo com erro, remover token
          localStorage.removeItem('eleve_token');
          console.log('🧹 [AUTH API] Token removido mesmo com erro');
        }
      },
    }),
    
    // Obter perfil do usuário
    getProfile: builder.query<User, void>({
      query: () => {
        console.log('🔄 [AUTH API] Buscando perfil em /auth/perfil/');
        return '/auth/perfil/';
      },
      providesTags: ['Auth'],
      transformResponse: (response: User) => {
        console.log('✅ [AUTH API] Perfil carregado:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ [AUTH API] Erro ao buscar perfil:', response);
        
        // Se for 401, token inválido - limpar localStorage
        if (response.status === 401) {
          localStorage.removeItem('eleve_token');
          console.log('🧹 [AUTH API] Token inválido - Limpando localStorage');
        }
        
        return response;
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