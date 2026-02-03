// src/services/campaignsApi.ts

import { apiSlice } from '../apiSlice'
import type {
  Campaign,
  CampaignFormData,
  CampaignAnalytics,
  MessageTemplate,
  AudienceFilter,
  CampaignStatus,
  CampaignType,
} from '../../types/campaigns/campaign.types';

// ============================================================================
// TYPES PARA QUERIES
// ============================================================================

interface GetCampaignsParams {
  status?: CampaignStatus;
  type?: CampaignType;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface AudiencePreviewRequest {
  filters: AudienceFilter[];
  school: number;
}

interface AudiencePreviewResponse {
  count: number;
  sample_contacts: Array<{
    id: number;
    name: string;
    email?: string;
    phone?: string;
  }>;
}

// ============================================================================
// CAMPAIGNS API
// ============================================================================

export const campaignsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ========================================================================
    // CAMPAIGNS CRUD
    // ========================================================================
    
    /**
     * Buscar campanhas com filtros e paginação
     */
    getCampaigns: builder.query<PaginatedResponse<Campaign>, GetCampaignsParams | void>({
      query: (params = {}) => ({
        url: '/campaigns/',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Campaigns' as const, id })),
              { type: 'Campaigns', id: 'LIST' },
            ]
          : [{ type: 'Campaigns', id: 'LIST' }],
      // Configuração de cache
      keepUnusedDataFor: 60, // 60 segundos
    }),
    
    /**
     * Buscar campanha específica por ID
     */
    getCampaign: builder.query<Campaign, number>({
      query: (id) => `/campaigns/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Campaigns', id }],
    }),
    
    /**
     * Criar nova campanha
     */
    createCampaign: builder.mutation<Campaign, CampaignFormData>({
      query: (data) => ({
        url: '/campaigns/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Campaigns', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: newCampaign } = await queryFulfilled;
          
          // Atualiza cache da lista
          dispatch(
            campaignsApi.util.updateQueryData('getCampaigns', undefined, (draft) => {
              draft.results.unshift(newCampaign);
              draft.count += 1;
            })
          );
        } catch {
          // Erro já tratado pelo RTK Query
        }
      },
    }),
    
    /**
     * Atualizar campanha existente
     */
    updateCampaign: builder.mutation<
      Campaign,
      { id: number; data: Partial<CampaignFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/campaigns/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Campaigns', id },
        { type: 'Campaigns', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          campaignsApi.util.updateQueryData('getCampaign', id, (draft) => {
            Object.assign(draft, data);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    /**
     * Deletar campanha
     */
    deleteCampaign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campaigns/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
        { type: 'Campaigns', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          campaignsApi.util.updateQueryData('getCampaigns', undefined, (draft) => {
            const index = draft.results.findIndex((c) => c.id === id);
            if (index !== -1) {
              draft.results.splice(index, 1);
              draft.count -= 1;
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    // ========================================================================
    // CAMPAIGN ACTIONS
    // ========================================================================
    
    /**
     * Enviar campanha
     */
    sendCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/send/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
        { type: 'Campaigns', id: 'LIST' },
        { type: 'CampaignAnalytics', id },
      ],
    }),
    
    /**
     * Pausar campanha
     */
    pauseCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/pause/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Campaigns', id }],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          campaignsApi.util.updateQueryData('getCampaign', id, (draft) => {
            draft.status = 'paused';
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    /**
     * Retomar campanha
     */
    resumeCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/resume/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Campaigns', id }],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          campaignsApi.util.updateQueryData('getCampaign', id, (draft) => {
            draft.status = 'sending';
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    /**
     * Cancelar campanha
     */
    cancelCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
        { type: 'Campaigns', id: 'LIST' },
      ],
    }),
    
    /**
     * Duplicar campanha
     */
    duplicateCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/duplicate/`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Campaigns', id: 'LIST' }],
    }),
    
    // ========================================================================
    // ANALYTICS
    // ========================================================================
    
    /**
     * Buscar analytics da campanha
     */
    getCampaignAnalytics: builder.query<CampaignAnalytics, number>({
      query: (id) => `/campaigns/${id}/analytics/`,
      providesTags: (result, error, id) => [{ type: 'CampaignAnalytics', id }],
      // Polling automático para campanhas em andamento
      // pollingInterval: 30000, // 30 segundos
    }),
    
    /**
     * Exportar relatório de analytics
     */
    exportCampaignReport: builder.mutation<Blob, {
      id: number;
      format: 'pdf' | 'csv' | 'xlsx';
    }>({
      query: ({ id, format }) => ({
        url: `/campaigns/${id}/export/`,
        method: 'POST',
        body: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    // ========================================================================
    // AUDIENCE
    // ========================================================================
    
    /**
     * Preview da audiência baseado nos filtros
     */
    previewAudience: builder.mutation<AudiencePreviewResponse, AudiencePreviewRequest>({
      query: (data) => ({
        url: '/campaigns/preview-audience/',
        method: 'POST',
        body: data,
      }),
    }),
    
    /**
     * Salvar segmento de audiência
     */
    saveAudienceSegment: builder.mutation<
      { id: number; name: string; filters: AudienceFilter[] },
      { name: string; filters: AudienceFilter[] }
    >({
      query: (data) => ({
        url: '/audience-segments/',
        method: 'POST',
        body: data,
      }),
    }),
    
    /**
     * Buscar segmentos salvos
     */
    getAudienceSegments: builder.query<
      Array<{ id: number; name: string; filters: AudienceFilter[]; count: number }>,
      void
    >({
      query: () => '/audience-segments/',
    }),
    
    // ========================================================================
    // TEMPLATES
    // ========================================================================
    
    /**
     * Buscar templates de mensagem
     */
    getTemplates: builder.query<
      PaginatedResponse<MessageTemplate>,
      { type?: string; search?: string } | void
    >({
      query: (params = {}) => ({
        url: '/campaign-templates/',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Templates' as const, id })),
              { type: 'Templates', id: 'LIST' },
            ]
          : [{ type: 'Templates', id: 'LIST' }],
    }),
    
    /**
     * Buscar template específico
     */
    getTemplate: builder.query<MessageTemplate, number>({
      query: (id) => `/campaign-templates/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),
    
    /**
     * Criar template
     */
    createTemplate: builder.mutation<MessageTemplate, Partial<MessageTemplate>>({
      query: (data) => ({
        url: '/campaign-templates/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Templates', id: 'LIST' }],
    }),
    
    /**
     * Atualizar template
     */
    updateTemplate: builder.mutation<
      MessageTemplate,
      { id: number; data: Partial<MessageTemplate> }
    >({
      query: ({ id, data }) => ({
        url: `/campaign-templates/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Templates', id },
        { type: 'Templates', id: 'LIST' },
      ],
    }),
    
    /**
     * Deletar template
     */
    deleteTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campaign-templates/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Templates', id },
        { type: 'Templates', id: 'LIST' },
      ],
    }),
    
    // ========================================================================
    // STATISTICS
    // ========================================================================
    
    /**
     * Buscar estatísticas gerais de campanhas
     */
    getCampaignStats: builder.query<{
      total: number;
      draft: number;
      scheduled: number;
      sending: number;
      completed: number;
      avg_delivery_rate: number;
      avg_open_rate: number;
      avg_conversion_rate: number;
      sent_today: number;
    }, void>({
      query: () => '/campaigns/stats/',
      providesTags: ['Campaigns'],
    }),
    
  }),
});

// ============================================================================
// EXPORT HOOKS
// ============================================================================

export const {
  // Campaigns CRUD
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  
  // Campaign Actions
  useSendCampaignMutation,
  usePauseCampaignMutation,
  useResumeCampaignMutation,
  useCancelCampaignMutation,
  useDuplicateCampaignMutation,
  
  // Analytics
  useGetCampaignAnalyticsQuery,
  useExportCampaignReportMutation,
  
  // Audience
  usePreviewAudienceMutation,
  useSaveAudienceSegmentMutation,
  useGetAudienceSegmentsQuery,
  
  // Templates
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  
  // Statistics
  useGetCampaignStatsQuery,
} = campaignsApi;