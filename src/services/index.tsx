// ✅ COMPLETO - src/services/index.tsx

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
export type { User, LoginRequest, RegisterRequest, AuthResponse } from './api/authApi';

// ============================================
// SCHOOLS API
// ============================================
export { schoolsApi } from './api/schoolsApi';
export {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useGetSchoolUsersQuery,
  useGenerateTokenMutation,
} from './api/schoolsApi';
export type { School, SchoolsResponse, Perfil } from './api/schoolsApi';

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
export type { Contact, ContactsResponse, ContactStats, ContactFilters } from './api/contactsApi';

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
export type { Lead, LeadsResponse, LeadStats, LeadFilters } from './api/leadsApi';

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
} from './api/eventsApi';
export type { Event, EventsResponse } from './api/eventsApi';

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
export type { FAQ, FAQsResponse, FAQFilters } from './api/faqsApi';

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
export type { Ticket, TicketsResponse, TicketFilters } from './api/ticketsApi';

// ============================================
// DASHBOARD API
// ============================================
export { dashboardApi } from './api/dashboardApi';
export {
  useGetDashboardQuery,
  useGetDashboardByIdQuery,
  useUpdateDashboardMutation,
} from './api/dashboardApi';
export type { Dashboard, DashboardResponse } from './api/dashboardApi';