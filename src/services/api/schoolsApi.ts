// src/services/api/schoolsApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface School {
  id: number;
  usuario_id: number;
  usuario_username: string;
  nome_escola: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  logo: string | null;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  complemento: string;
  sobre: string;
  niveis_ensino: {
    infantil?: boolean;
    fundamental?: boolean;
    medio?: boolean;
  };
  token_mensagens: string;
  criado_em: string;
  atualizado_em: string;
}

export interface SchoolsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

export interface Perfil {
  id: number;
  usuario: number;
  escola: number;
  escola_nome: string;
  tipo: 'gestor' | 'operador';
  tipo_display: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// ============================================
// API
// ============================================

export const schoolsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Listar escolas do usuário
    getSchools: builder.query<SchoolsResponse, { search?: string; page?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append('search', params.search);
        if (params.page) searchParams.append('page', params.page.toString());
        
        const queryString = searchParams.toString();
        return queryString ? `/schools/?${queryString}` : '/schools/';
      },
      providesTags: ['School'],
    }),
    
    // Obter escola específica
    getSchoolById: builder.query<School, number>({
      query: (id) => `/schools/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'School', id }],
    }),
    
    // Criar escola
    createSchool: builder.mutation<School, Partial<School>>({
      query: (data) => ({
        url: '/schools/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['School'],
    }),
    
    // Atualizar escola
    updateSchool: builder.mutation<School, { id: number; data: Partial<School> }>({
      query: ({ id, data }) => ({
        url: `/schools/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'School', id },
        'School',
      ],
    }),
    
    // Deletar escola
    deleteSchool: builder.mutation<void, number>({
      query: (id) => ({
        url: `/schools/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),
    
    // Listar usuários da escola
    getSchoolUsers: builder.query<Perfil[], number>({
      query: (schoolId) => `/schools/${schoolId}/usuarios/`,
      providesTags: (_result, _error, schoolId) => [
        { type: 'School', id: schoolId },
      ],
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolUsersQuery,
} = schoolsApi;