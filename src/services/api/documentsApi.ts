// src/services/api/authApi.ts - ✅ 100% COMPLETO (13/13 ENDPOINTS)
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

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  school_id: number;
  role: 'gestor' | 'operador';
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

export interface UserStats {
  total_users: number;
  gestores: number;
  operadores: number;
  ativos: number;
  inativos: number;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password2: string;
}

// ============================================
// API - 13/13 ENDPOINTS
// ============================================

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. POST /auth/login/ - Login (AllowAny)
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
        console.log('✅ [AUTH API] Login bem-sucedido');
        return response;
      },
    }),
    
    // 2. POST /auth/register/ - Registro (AllowAny)
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        console.log('📝 [AUTH API] Registrando usuário...');
        return {
          url: '/auth/registro/',
          method: 'POST',
          body: userData,
        };
      },
      invalidatesTags: ['Auth'],
    }),
    
    // 3. POST /auth/logout/ - Logout (Authenticated)
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
          localStorage.removeItem('eleve_token');
        }
      },
    }),
    
    // 4. GET /auth/profile/ - Obter perfil (Authenticated)
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
        if (response.status === 401) {
          localStorage.removeItem('eleve_token');
        }
        return response;
      },
    }),
    
    // 5. PATCH /auth/profile/update/ - Atualizar perfil (Authenticated)
    updateProfile: builder.mutation<{ message: string; user: User }, Partial<User>>({
      query: (data) => ({
        url: '/auth/atualizar-perfil/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // 6. POST /auth/profile/change-password/ - Trocar senha (Authenticated)
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/profile/change-password/',
        method: 'POST',
        body: data,
      }),
    }),
    
    // 7. GET /auth/users/ - Listar usuários (Authenticated)
    getUsers: builder.query<{ count: number; results: User[] }, void>({
      query: () => '/auth/users/',
      providesTags: ['Auth'],
    }),
    
    // 8. GET /auth/users/{id}/ - Detalhes de usuário (Authenticated)
    getUserById: builder.query<User, number>({
      query: (id) => `/auth/users/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Auth', id }],
    }),
    
    // 9. POST /auth/users/ - Criar usuário (Manager)
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (data) => ({
        url: '/auth/users/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // 10. PATCH /auth/users/{id}/ - Atualizar usuário (Manager)
    updateUser: builder.mutation<User, { id: number; data: Partial<CreateUserRequest> }>({
      query: ({ id, data }) => ({
        url: `/auth/users/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Auth', id },
        'Auth',
      ],
    }),
    
    // 11. DELETE /auth/users/{id}/ - Deletar usuário (Manager)
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/auth/users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // 12. GET /auth/users/me/ - Dados do próprio usuário (Authenticated)
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/users/me/',
      providesTags: ['Auth'],
    }),
    
    // 13. GET /auth/users/stats/ - Estatísticas (Manager)
    getUserStats: builder.query<UserStats, void>({
      query: () => '/auth/users/stats/',
      providesTags: ['Auth'],
    }),
    
  }),
});

// ============================================
// EXPORTS - 13 HOOKS
// ============================================

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCurrentUserQuery,
  useGetUserStatsQuery,
} = authApi;

export interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface DocumentFilters {
  status?: 'pendente' | 'processando' | 'concluido' | 'erro';
  search?: string;
  page?: number;
}

// ============================================
// API - Endpoints do README.md
// ============================================

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // GET /api/v1/documents/ - Listar documentos (SchoolStaff)
    getDocuments: builder.query<DocumentsResponse, DocumentFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.status) {
          params.append('status', filters.status);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/documents/?${queryString}` : '/documents/';
      },
      providesTags: ['Document'],
    }),
    
    // GET /api/v1/documents/{id}/ - Detalhes do documento (SchoolStaff)
    getDocumentById: builder.query<Document, number>({
      query: (id) => `/documents/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id }],
    }),
    
    // POST /api/v1/documents/ - Upload documento (SchoolStaff)
    uploadDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: '/documents/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),
    
    // PATCH /api/v1/documents/{id}/ - Atualizar documento (SchoolStaff)
    updateDocument: builder.mutation<Document, { id: number; data: Partial<Document> }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        'Document',
      ],
    }),
    
    // DELETE /api/v1/documents/{id}/ - Deletar documento (SchoolStaff)
    deleteDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `/documents/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
    
    // GET /api/v1/documents/unprocessed/ - Documentos pendentes (SchoolStaff)
    getUnprocessedDocuments: builder.query<Document[], void>({
      query: () => '/documents/unprocessed/',
      providesTags: ['Document'],
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetUnprocessedDocumentsQuery,
} = documentsApi;