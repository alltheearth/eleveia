import { baseApi } from "./baseApi";

export interface FAQ {
  id: number;
  school: number;
  school_name: string;
  question: string;
  answer: string;
  category: 'Admission' | 'Pricing' | 'Uniform' | 'Schedule' | 'Documentation' | 'Activities' | 'Meals' | 'Transport' | 'Pedagogical' | 'General';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface FAQsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQ[];
}

export interface FAQFilters {
  status?: FAQ['status'];
  search?: string;
  page?: number;
}


export const faqsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<FAQsResponse, { status?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        
        const queryString = searchParams.toString();
        return queryString ? `/faqs/?${queryString}` : '/faqs/';
      },
      providesTags: ['FAQ'],
    }),
    
    getFAQById: builder.query<FAQ, number>({
      query: (id) => `/faqs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'FAQ', id }],
    }),
    
    createFAQ: builder.mutation<FAQ, Partial<FAQ>>({
      query: (data) => ({
        url: '/faqs/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FAQ'],
    }),
    
    updateFAQ: builder.mutation<FAQ, { id: number; data: Partial<FAQ> }>({
      query: ({ id, data }) => ({
        url: `/faqs/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'FAQ', id }, 'FAQ'],
    }),
    
    deleteFAQ: builder.mutation<void, number>({
      query: (id) => ({
        url: `/faqs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
});

export const {
  useGetFAQsQuery,
  useGetFAQByIdQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqsApi;