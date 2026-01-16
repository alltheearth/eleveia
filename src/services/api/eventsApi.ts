// src/services/api/eventsApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

export interface Event {
  id: number;
  escola: number;
  escola_nome: string;
  data: string;
  evento: string;
  tipo: 'feriado' | 'prova' | 'formatura' | 'evento_cultural';
  criado_em: string;
  atualizado_em: string;
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, void>({
      query: () => '/events/',
      providesTags: ['Event'],
    }),
    
    getEventById: builder.query<Event, number>({
      query: (id) => `/events/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    
    createEvent: builder.mutation<Event, Partial<Event>>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    
    updateEvent: builder.mutation<Event, { id: number; data: Partial<Event> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event', id }, 'Event'],
    }),
    
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    
    getUpcomingEvents: builder.query<Event[], void>({
      query: () => '/events/proximos_eventos/',
      providesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcomingEventsQuery,
} = eventsApi;