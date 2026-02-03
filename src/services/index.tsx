// src/services/index.ts - ✅ EXPORT CENTRAL ORGANIZADO

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
// SCHOOLS API
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
// MESSAGING API (WhatsApp/Uazapi) - ✅ NOVO
// ============================================
// export { messagingApi } from './api/messagingApi';
// export {
//   useGetInstanceStatusQuery,
//   useConnectInstanceMutation,
//   useDisconnectInstanceMutation,
// } from './api/messagingApi';
// export type {
//   InstanceData,
//   ConnectResponse,
//   DisconnectResponse,
//   StatusResponse,
// } from './api/messagingApi';

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
  EventFormData,
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

// ============================================
// CONTACTS API
// ============================================
export { contactsApi } from './api/contactsApi';
export {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useRegisterInteractionMutation,
  useGetContactStatsQuery,
} from './api/contactsApi';
export type {
  Contact,
  ContactsResponse,
  ContactStats,
  ContactFilters,
} from './api/contactsApi';

// ============================================
// TICKETS API
// ============================================
export { ticketsApi } from './api/ticketsApi';
export {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useChangeTicketStatusMutation,
  useAssignTicketMutation,
  useGetTicketStatsQuery,
  useGetRecentTicketsQuery,
  useExportTicketsCSVMutation,
} from './api/ticketsApi';
export type {
  Ticket,
  TicketsResponse,
  TicketStats,
  TicketFilters,
} from './api/ticketsApi';

// ============================================
// DASHBOARD API
// ============================================
export { dashboardApi } from './api/dashboardApi';
export {
  useGetDashboardQuery,
  useGetDashboardByIdQuery,
  useUpdateDashboardMutation,
} from './api/dashboardApi';
export type {
  Dashboard,
  DashboardResponse,
} from './api/dashboardApi';

// ============================================
// HOOKS CUSTOMIZADOS
// ============================================
// export { useMessaging } from './hooks/useMessaging';