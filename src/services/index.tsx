// src/services/index.tsx - ✅ VERSÃO CORRIGIDA
// Export central de todos os serviços da API

// ============================================
// BASE API
// ============================================
export { baseApi, extractErrorMessage } from './api/baseApi';

// ============================================
// AUTH API
// ============================================
export { authApi } from './api/authApi';
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from './api/authApi';
export type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
} from './api/authApi';

// ============================================
// SCHOOLS API - ✅ CORRIGIDO
// ============================================
export { schoolsApi } from './api/schoolsApi';
export {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolStatsQuery,
  useGetMySchoolQuery,
} from './api/schoolsApi';
export type { 
  School, 
  SchoolsResponse,
  SchoolFilters,
  TeachingLevels,
} from './api/schoolsApi';

// ============================================
// LEADS API
// ============================================
export { leadsApi } from './api/leadsApi';
export {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useChangeLeadStatusMutation,
  useGetLeadStatsQuery,
  useGetRecentLeadsQuery,
  useExportLeadsCSVMutation,
} from './api/leadsApi';
export type { 
  Lead, 
  LeadsResponse, 
  LeadStats, 
  LeadFilters 
} from './api/leadsApi';

// ============================================
// EVENTS API
// ============================================
export { eventsApi } from './api/eventsApi';
export {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcomingEventsQuery,
  useGetEventStatsQuery,
} from './api/eventsApi';
export type { 
  Event, 
  EventsResponse,
  EventFilters,
} from './api/eventsApi';

// ============================================
// FAQS API
// ============================================
export { faqsApi } from './api/faqsApi';
export {
  useGetFAQsQuery,
  useGetFAQByIdQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from './api/faqsApi';
export type { 
  FAQ, 
  FAQsResponse, 
  FAQFilters 
} from './api/faqsApi';

// ============================================
// DOCUMENTS API
// ============================================
export { documentsApi } from './api/documentsApi';
export {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetUnprocessedDocumentsQuery,
} from './api/documentsApi';
export type { 
  Document, 
  DocumentsResponse, 
  DocumentFilters 
} from './api/documentsApi';