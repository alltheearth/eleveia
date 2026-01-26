// src/services/api/eventsApi.ts - UPDATED WITH DATE RANGE
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface Event {
  id: number;
  school: number;
  school_name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  title: string;
  description: string;
  event_type: 'holiday' | 'exam' | 'graduation' | 'cultural';
  event_type_display: string;
  duration_days: number;
  is_single_day: boolean;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface EventFilters {
  event_type?: 'all' | Event['event_type'];
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  search?: string;
  page?: number;
}

export interface EventFormData {
  school: number;
  start_date: string;
  end_date: string;
  title: string;
  description?: string;
  event_type: Event['event_type'];
}

// ============================================
// API
// ============================================

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // List events with filters
    getEvents: builder.query<EventsResponse, EventFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.event_type && filters.event_type !== 'all') {
          params.append('event_type', filters.event_type);
        }
        if (filters?.start_date) {
          params.append('start_date', filters.start_date);
        }
        if (filters?.end_date) {
          params.append('end_date', filters.end_date);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/events/?${queryString}` : '/events/';
      },
      providesTags: ['Event'],
    }),
    
    // Get single event
    getEventById: builder.query<Event, number>({
      query: (id) => `/events/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    
    // Create event
    createEvent: builder.mutation<Event, EventFormData>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    
    // Update event
    updateEvent: builder.mutation<Event, { id: number; data: Partial<EventFormData> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Event', id },
        'Event',
      ],
    }),
    
    // Delete event
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    
    // Get upcoming events
    getUpcomingEvents: builder.query<Event[], void>({
      query: () => '/events/upcoming/',
      providesTags: ['Event'],
    }),
    
    // Get statistics
    getEventStats: builder.query<{
      total: number;
      by_type: Record<string, number>;
      upcoming: number;
    }, void>({
      query: () => '/events/statistics/',
      providesTags: ['Event'],
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetUpcomingEventsQuery,
  useGetEventStatsQuery,
} = eventsApi;