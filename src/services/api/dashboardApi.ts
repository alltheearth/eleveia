// src/services/api/dashboardApi.ts
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface Dashboard {
  id: number;
  escola: number;
  escola_nome: string;
  status_agente: string;
  interacoes_hoje: number;
  documentos_upload: number;
  faqs_criadas: number;
  leads_capturados: number;
  taxa_resolucao: number;
  novos_hoje: number;
  atualizado_em: string;
}

export interface DashboardResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dashboard[];
}

// ============================================
// API
// ============================================

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Obter dashboard da escola
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => '/dashboard/',
      providesTags: ['Dashboard'],
    }),
    
    // Obter dashboard por ID
    getDashboardById: builder.query<Dashboard, number>({
      query: (id) => `/dashboard/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Dashboard', id }],
    }),
    
    // Atualizar dashboard
    updateDashboard: builder.mutation<Dashboard, { id: number; data: Partial<Dashboard> }>({
      query: ({ id, data }) => ({
        url: `/dashboard/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Dashboard', id },
        'Dashboard',
      ],
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetDashboardQuery,
  useGetDashboardByIdQuery,
  useUpdateDashboardMutation,
} = dashboardApi;