// src/services/api/documentsApi.ts
import { baseApi } from './baseApi';

// ============================================
// TYPES — espelham o DocumentSerializer do Django
// ============================================

export interface Document {
  id: number;
  school: number;
  school_name: string;        // read-only, vem do source='school.school_name'
  name: string;               // CharField(max_length=255)
  file: string;               // FileField — retorna a URL do arquivo
  status: 'pending' | 'processing' | 'processed' | 'error';
  created_at: string;         // DateTimeField auto_now_add
  updated_at: string;         // DateTimeField auto_now
}

export interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface DocumentFilters {
  status?: Document['status'];
  search?: string;
  page?: number;
}

// Para a mutation de upload: o que a gente envia ao backend
export interface UploadDocumentArgs {
  name: string;   // nome do documento
  file: File;     // arquivo propriamente
  formData: true; // flag que a gente usa para o baseApi não setar Content-Type
}

// ============================================
// API
// ============================================

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /documents/?status=&search=&page=
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

        const qs = params.toString();
        return qs ? `/documents/?${qs}` : '/documents/';
      },
      providesTags: ['Document'],
    }),

    // GET /documents/{id}/
    getDocumentById: builder.query<Document, number>({
      query: (id) => `/documents/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id }],
    }),

    // POST /documents/  — multipart/form-data com name + file
    uploadDocument: builder.mutation<Document, UploadDocumentArgs>({
      query: ({ name, file }) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        return {
          url: '/documents/',
          method: 'POST',
          body: formData,
        };
      },
      // Passa a flag formData no meta para o baseApi não setar Content-Type
      // RTK Query repassa o arg original como meta.arg
      invalidatesTags: ['Document'],
    }),

    // PATCH /documents/{id}/  — atualiza apenas nome
    updateDocument: builder.mutation<Document, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/documents/${id}/`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        'Document',
      ],
    }),

    // DELETE /documents/{id}/
    deleteDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `/documents/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),

    // GET /documents/unprocessed/  — retorna pending + error
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