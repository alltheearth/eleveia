// src/services/api/leadsApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface Lead {
  id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  status_display: string;
  origem: 'site' | 'whatsapp' | 'indicacao' | 'ligacao' | 'email' | 'facebook' | 'instagram';
  origem_display: string;
  observacoes: string;
  interesses: Record<string, any>;
  contatado_em: string | null;
  convertido_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface LeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

export interface LeadStats {
  total: number;
  novo: number;
  contato: number;
  qualificado: number;
  conversao: number;
  perdido: number;
  por_origem: Record<string, number>;
  novos_hoje: number;
  taxa_conversao: number;
}

export interface LeadFilters {
  status?: string;
  origem?: string;
  search?: string;
  page?: number;
}

// ============================================
// API
// ============================================

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Listar leads
    getLeads: builder.query<LeadsResponse, LeadFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters?.origem) {
          params.append('origem', filters.origem);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/leads/?${queryString}` : '/leads/';
      },
      providesTags: ['Lead'],
    }),
    
    // Obter lead específico
    getLeadById: builder.query<Lead, number>({
      query: (id) => `/leads/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Lead', id }],
    }),
    
    // Criar lead
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (data) => ({
        url: '/leads/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lead'],
    }),
    
    // Atualizar lead
    updateLead: builder.mutation<Lead, { id: number; data: Partial<Lead> }>({
      query: ({ id, data }) => ({
        url: `/leads/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lead', id },
        'Lead',
      ],
    }),
    
    // Deletar lead
    deleteLead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/leads/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),
    
    // Mudar status do lead
    changeLeadStatus: builder.mutation<Lead, { id: number; status: Lead['status'] }>({
      query: ({ id, status }) => ({
        url: `/leads/${id}/mudar_status/`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lead', id },
        'Lead',
      ],
    }),
    
    // Obter estatísticas
    getLeadStats: builder.query<LeadStats, void>({
      query: () => '/leads/estatisticas/',
    }),
    
    // Leads recentes
    getRecentLeads: builder.query<Lead[], number | void>({
      query: (limit = 10) => `/leads/recentes/?limit=${limit}`,
      providesTags: ['Lead'],
    }),
    
    // Exportar CSV
    exportLeadsCSV: builder.mutation<Blob, void>({
      query: () => ({
        url: '/leads/exportar_csv/',
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useChangeLeadStatusMutation,
  useGetLeadStatsQuery,
  useGetRecentLeadsQuery,
  useExportLeadsCSVMutation,
} = leadsApi;