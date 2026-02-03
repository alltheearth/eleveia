// src/services/campaignsApi.ts
// 🔌 EXEMPLO DE INTEGRAÇÃO COM BACKEND - RTK Query

import { apiSlice } from './apiSlice';
import type { 
  Campaign, 
  CampaignFormData,
  CampaignAnalytics,
} from '../../types/campaigns/campaign.types';
import type { MessageTemplate } from '../../types/campaigns/message.types';
import type { AudienceFilter } from '../../types/campaigns/audience.types';

// ============================================
// INTERFACES DE QUERY PARAMS
// ============================================

interface GetCampaignsParams {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

interface PreviewAudienceParams {
  filters: AudienceFilter[];
  school: number;
}

interface PreviewAudienceResponse {
  count: number;
  sample_contacts: Array<{
    id: number;
    name: string;
    email?: string;
    phone?: string;
  }>;
}

// ============================================
// API ENDPOINTS
// ============================================

export const campaignsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ============================================
    // CAMPANHAS CRUD
    // ============================================
    
    getCampaigns: builder.query<{ results: Campaign[] }, GetCampaignsParams>({
      query: (params) => ({
        url: '/campaigns/',
        params,
      }),
      providesTags: ['Campaigns'],
    }),
    
    getCampaign: builder.query<Campaign, number>({
      query: (id) => `/campaigns/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Campaigns', id }],
    }),
    
    createCampaign: builder.mutation<Campaign, CampaignFormData>({
      query: (data) => ({
        url: '/campaigns/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Campaigns'],
    }),
    
    updateCampaign: builder.mutation<Campaign, { 
      id: number; 
      data: Partial<CampaignFormData> 
    }>({
      query: ({ id, data }) => ({
        url: `/campaigns/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Campaigns', id },
        'Campaigns',
      ],
    }),
    
    deleteCampaign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campaigns/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaigns'],
    }),
    
    // ============================================
    // AÇÕES DE CAMPANHA
    // ============================================
    
    sendCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/send/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
        'Campaigns',
      ],
    }),
    
    pauseCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/pause/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
      ],
    }),
    
    resumeCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/resume/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
      ],
    }),
    
    cancelCampaign: builder.mutation<Campaign, number>({
      query: (id) => ({
        url: `/campaigns/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaigns', id },
        'Campaigns',
      ],
    }),
    
    // ============================================
    // ANALYTICS
    // ============================================
    
    getCampaignAnalytics: builder.query<CampaignAnalytics, number>({
      query: (id) => `/campaigns/${id}/analytics/`,
      providesTags: (result, error, id) => [
        { type: 'CampaignAnalytics', id }
      ],
    }),
    
    // ============================================
    // PREVIEW DE AUDIÊNCIA
    // ============================================
    
    previewAudience: builder.mutation<PreviewAudienceResponse, PreviewAudienceParams>({
      query: (data) => ({
        url: '/campaigns/preview-audience/',
        method: 'POST',
        body: data,
      }),
    }),
    
    // ============================================
    // TEMPLATES
    // ============================================
    
    getTemplates: builder.query<{ results: MessageTemplate[] }, {
      type?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/campaign-templates/',
        params,
      }),
      providesTags: ['Templates'],
    }),
    
    getTemplate: builder.query<MessageTemplate, number>({
      query: (id) => `/campaign-templates/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),
    
    createTemplate: builder.mutation<MessageTemplate, Partial<MessageTemplate>>({
      query: (data) => ({
        url: '/campaign-templates/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Templates'],
    }),
    
    updateTemplate: builder.mutation<MessageTemplate, {
      id: number;
      data: Partial<MessageTemplate>;
    }>({
      query: ({ id, data }) => ({
        url: `/campaign-templates/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Templates', id },
        'Templates',
      ],
    }),
    
    deleteTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campaign-templates/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),
    
  }),
});

// ============================================
// EXPORTS DOS HOOKS
// ============================================

export const {
  // Campanhas
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  
  // Ações
  useSendCampaignMutation,
  usePauseCampaignMutation,
  useResumeCampaignMutation,
  useCancelCampaignMutation,
  
  // Analytics
  useGetCampaignAnalyticsQuery,
  
  // Audiência
  usePreviewAudienceMutation,
  
  // Templates
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = campaignsApi;
