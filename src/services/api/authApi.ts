// src/services/api/authApi.ts - ✅ CORRIGIDO COM PERSISTÊNCIA
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
      // ✅ CRÍTICO: onQueryStarted para salvar IMEDIATAMENTE
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [AUTH] Login response:', data);
          
          // ✅ SALVAR TOKEN IMEDIATAMENTE
          if (data.token) {
            localStorage.setItem('eleve_token', data.token);
            console.log('✅ [AUTH] Token salvo no localStorage:', data.token.substring(0, 20) + '...');
            
            // ✅ VERIFICAR SE SALVOU
            const savedToken = localStorage.getItem('eleve_token');
            console.log('✅ [AUTH] Token verificado:', savedToken ? 'OK' : 'FALHOU');
          } else {
            console.error('❌ [AUTH] Resposta não contém token!');
          }
        } catch (error) {
          console.error('❌ [AUTH] Erro no login:', error);
        }
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
      // ✅ CRÍTICO: onQueryStarted para salvar IMEDIATAMENTE
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [AUTH] Register response:', data);
          
          // ✅ SALVAR TOKEN IMEDIATAMENTE
          if (data.token) {
            localStorage.setItem('eleve_token', data.token);
            console.log('✅ [AUTH] Token salvo no localStorage:', data.token.substring(0, 20) + '...');
            
            // ✅ VERIFICAR SE SALVOU
            const savedToken = localStorage.getItem('eleve_token');
            console.log('✅ [AUTH] Token verificado:', savedToken ? 'OK' : 'FALHOU');
          } else {
            console.error('❌ [AUTH] Resposta não contém token!');
          }
        } catch (error) {
          console.error('❌ [AUTH] Erro no registro:', error);
        }
      },
    }),
    
    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      // ✅ SEMPRE REMOVE TOKEN, mesmo com erro
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('✅ [AUTH] Logout bem-sucedido');
        } catch (error) {
          console.error('⚠️ [AUTH] Erro no logout, mas limpando token mesmo assim');
        } finally {
          localStorage.removeItem('eleve_token');
          console.log('✅ [AUTH] Token removido do localStorage');
        }
      },
    }),
    
    // Obter perfil do usuário
    getProfile: builder.query<User, void>({
      query: () => '/auth/perfil/',
      providesTags: ['Auth'],
      transformErrorResponse: (error: any) => {
        console.error('❌ [AUTH] Erro ao buscar perfil:', error);
        
        // Se for 401, token inválido
        if (error.status === 401) {
          console.error('❌ [AUTH] Token inválido - Limpando localStorage');
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