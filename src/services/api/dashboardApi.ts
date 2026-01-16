// src/services/api/dashboardApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

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

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => '/dashboard/',
      providesTags: ['Dashboard'],
    }),
    
    getDashboardById: builder.query<Dashboard, number>({
      query: (id) => `/dashboard/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Dashboard', id }],
    }),
    
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

export const {
  useGetDashboardQuery,
  useGetDashboardByIdQuery,
  useUpdateDashboardMutation,
} = dashboardApi;