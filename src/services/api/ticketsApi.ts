import { baseApi } from "./baseApi";

export interface Ticket {
  id: number;
  school: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'closed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface TicketsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<TicketsResponse, void>({
      query: () => '/tickets/',
      providesTags: ['Ticket'],
    }),
    
    getTicketById: builder.query<Ticket, number>({
      query: (id) => `/tickets/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),
    
    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (data) => ({
        url: '/tickets/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    updateTicket: builder.mutation<Ticket, { id: number; data: Partial<Ticket> }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
    
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tickets/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;