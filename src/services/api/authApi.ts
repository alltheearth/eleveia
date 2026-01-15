// src/services/api/ticketsApi.ts - ✅ 100% COMPLETO (12/12 ENDPOINTS)
import { baseApi } from "./baseApi";

// ============================================
// TYPES
// ============================================

export interface Ticket {
  id: number;
  school: number;
  school_name: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'urgent';
  priority_display: string;
  status: 'open' | 'in_progress' | 'pending' | 'closed' | 'resolved';
  status_display: string;
  created_by: number;
  created_by_name: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

export interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  pending: number;
  resolved: number;
  closed: number;
  by_priority: Record<string, number>;
  recent_tickets: number;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
}

// ============================================
// API - 12/12 ENDPOINTS DO README.md
// ============================================

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. GET /tickets/ - Listar tickets (Authenticated - End users veem apenas seus)
    getTickets: builder.query<TicketsResponse, TicketFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters?.priority && filters.priority !== 'todas') {
          params.append('priority', filters.priority);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/tickets/?${queryString}` : '/tickets/';
      },
      providesTags: ['Ticket'],
    }),
    
    // 2. GET /tickets/{id}/ - Detalhes do ticket (Owner/SchoolStaff)
    getTicketById: builder.query<Ticket, number>({
      query: (id) => `/tickets/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),
    
    // 3. POST /tickets/ - Criar ticket (Authenticated)
    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (data) => ({
        url: '/tickets/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    // 4. PATCH /tickets/{id}/ - Atualizar ticket (Owner/SchoolStaff)
    updateTicket: builder.mutation<Ticket, { id: number; data: Partial<Ticket> }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ticket', id },
        'Ticket',
      ],
    }),
    
    // 5. DELETE /tickets/{id}/ - Deletar ticket (SchoolStaff)
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tickets/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    // 6. GET /tickets/my_tickets/ - Meus tickets (Authenticated)
    getMyTickets: builder.query<Ticket[], void>({
      query: () => '/tickets/my_tickets/',
      providesTags: ['Ticket'],
    }),
    
    // 7. GET /tickets/open_tickets/ - Tickets abertos (SchoolStaff)
    getOpenTickets: builder.query<Ticket[], void>({
      query: () => '/tickets/open_tickets/',
      providesTags: ['Ticket'],
    }),
    
    // 8. POST /tickets/{id}/change_status/ - Mudar status (SchoolStaff)
    changeTicketStatus: builder.mutation<Ticket, { id: number; status: Ticket['status'] }>({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/change_status/`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ticket', id },
        'Ticket',
      ],
    }),
    
    // 9. POST /tickets/{id}/assign/ - Atribuir ticket (SchoolStaff)
    assignTicket: builder.mutation<Ticket, { id: number; assigned_to: number }>({
      query: ({ id, assigned_to }) => ({
        url: `/tickets/${id}/assign/`,
        method: 'POST',
        body: { assigned_to },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ticket', id },
        'Ticket',
      ],
    }),
    
    // 10. GET /tickets/statistics/ - Estatísticas (SchoolStaff)
    getTicketStats: builder.query<TicketStats, void>({
      query: () => '/tickets/statistics/',
      providesTags: ['Ticket'],
    }),
    
    // 11. GET /tickets/recent/ - Tickets recentes (SchoolStaff)
    getRecentTickets: builder.query<Ticket[], number | void>({
      query: (limit = 10) => `/tickets/recent/?limit=${limit}`,
      providesTags: ['Ticket'],
    }),
    
    // 12. POST /tickets/export_csv/ - Exportar CSV (SchoolStaff)
    exportTicketsCSV: builder.mutation<Blob, TicketFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters?.priority && filters.priority !== 'todas') {
          params.append('priority', filters.priority);
        }
        const queryString = params.toString();
        
        return {
          url: queryString ? `/tickets/export_csv/?${queryString}` : '/tickets/export_csv/',
          method: 'POST',
          responseHandler: (response) => response.blob(),
        };
      },
    }),
    
  }),
});

// ============================================
// EXPORTS - 12 HOOKS
// ============================================

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetMyTicketsQuery,
  useGetOpenTicketsQuery,
  useChangeTicketStatusMutation,
  useAssignTicketMutation,
  useGetTicketStatsQuery,
  useGetRecentTicketsQuery,
  useExportTicketsCSVMutation,
} = ticketsApi;