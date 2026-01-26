// src/services/api/schoolsApi.ts - ✅ VERSÃO CORRIGIDA
import { baseApi } from './baseApi';

// ============================================
// TYPES - PADRONIZADO EM INGLÊS
// ============================================

export interface TeachingLevels {
  elementary?: boolean;
  high_school?: boolean;
  preschool?: boolean;
}

export interface School {
  // ✅ IDs e Metadados
  id: number;
  created_at: string;
  updated_at: string;
  
  // ✅ Informações Básicas (INGLÊS)
  school_name: string;        // era: nome_escola
  tax_id: string;             // era: cnpj
  messaging_token: string;    // era: token_mensagens
  
  // ✅ Contato (INGLÊS)
  phone: string;              // era: telefone
  email: string;
  website: string;
  logo: string | null;
  
  // ✅ Endereço (INGLÊS)
  postal_code: string;        // era: cep
  street_address: string;     // era: endereco
  city: string;               // era: cidade
  state: string;              // era: estado
  address_complement: string; // era: complemento
  
  // ✅ Informações Adicionais (INGLÊS)
  about: string;              // era: sobre
  teaching_levels: TeachingLevels; // era: niveis_ensino
}

export interface SchoolsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

export interface SchoolFilters {
  search?: string;
  page?: number;
}

// ============================================
// API
// ============================================

export const schoolsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Listar escolas do usuário
    getSchools: builder.query<SchoolsResponse, SchoolFilters>({
      query: (params = {}) => {
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
    
    // Estatísticas da escola
    getSchoolStats: builder.query<any, number>({
      query: (id) => `/schools/${id}/statistics/`,
      providesTags: (_result, _error, id) => [{ type: 'School', id }],
    }),
    
    // Minha escola
    getMySchool: builder.query<School, void>({
      query: () => '/schools/my_school/',
      providesTags: ['School'],
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
  useGetSchoolStatsQuery,
  useGetMySchoolQuery,
} = schoolsApi;