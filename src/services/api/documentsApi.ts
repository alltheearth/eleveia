// src/services/api/documentsApi.ts - ✅ CORRIGIDO
import { baseApi } from './baseApi';

export interface Document {
  id: number;
  escola: number;
  escola_nome: string;
  titulo: string;
  arquivo: string;
  tipo: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  criado_em: string;
  processado_em: string | null;
}

export interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface DocumentFilters {
  status?: 'pendente' | 'processando' | 'concluido' | 'erro';
  search?: string;
  page?: number;
}

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getDocuments: builder.query<DocumentsResponse, DocumentFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.status) {
          params.append('status', filters.status);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/documents/?${queryString}` : '/documents/';
      },
      providesTags: ['Document'],
    }),
    
    getDocumentById: builder.query<Document, number>({
      query: (id) => `/documents/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id }],
    }),
    
    uploadDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: '/documents/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),
    
    updateDocument: builder.mutation<Document, { id: number; data: Partial<Document> }>({
      query: ({ id, data }) => ({
        url: `/documents/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        'Document',
      ],
    }),
    
    deleteDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `/documents/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
    
    getUnprocessedDocuments: builder.query<Document[], void>({
      query: () => '/documents/unprocessed/',
      providesTags: ['Document'],
    }),
    
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetUnprocessedDocumentsQuery,
} = documentsApi;