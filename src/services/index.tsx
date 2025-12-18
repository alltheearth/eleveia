

// Base API
export { baseApi, extractErrorMessage } from './api/baseApi';

// Auth API
export { authApi } from './api/authApi';
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from './api/authApi';
export type { User, LoginRequest, RegisterRequest, AuthResponse } from './api/authApi';

// Schools API
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

// Contacts API
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

// Leads API
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

// Events API
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

// FAQs API
export { faqsApi } from './api/faqsApi';
export {
  useGetFAQsQuery,
  useGetFAQByIdQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from './api/faqsApi';
export type { FAQ, FAQsResponse } from './api/faqsApi';

// Tickets API
export { ticketsApi } from './api/ticketsApi';
export {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from './api/ticketsApi';
export type { Ticket, TicketsResponse } from './api/ticketsApi';

// Dashboard API
export { dashboardApi } from './api/dashboardApi';
export {
  useGetDashboardQuery,
  useGetDashboardByIdQuery,
  useUpdateDashboardMutation,
} from './api/dashboardApi';
export type { Dashboard, DashboardResponse } from './api/dashboardApi';