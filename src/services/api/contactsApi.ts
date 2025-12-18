// src/services/api/contactsApi.ts
import { baseApi } from './baseApi';

// ============================================
// TYPES
// ============================================

export interface Contact {
  id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string | null;
  status: 'ativo' | 'inativo';
  status_display: string;
  origem: 'whatsapp' | 'site' | 'telefone' | 'presencial' | 'email' | 'indicacao';
  origem_display: string;
  ultima_interacao: string | null;
  observacoes: string;
  tags: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ContactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export interface ContactStats {
  total: number;
  ativos: number;
  inativos: number;
  por_origem: Record<string, number>;
  novos_hoje: number;
  interacoes_recentes: number;
}

export interface ContactFilters {
  status?: 'ativo' | 'inativo' | 'todos';
  origem?: string;
  search?: string;
  page?: number;
}

// ============================================
// API
// ============================================

export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Listar contatos
    getContacts: builder.query<ContactsResponse, ContactFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters?.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters?.origem) {
          params.append('origem', filters.origem);
        }
        if (filters?.search) {
          params.append('search', filters.search);
        }
        if (filters?.page) {
          params.append('page', filters.page.toString());
        }
        
        const queryString = params.toString();
        return queryString ? `/contacts/?${queryString}` : '/contacts/';
      },
      providesTags: ['Contact'],
    }),
    
    // Obter contato específico
    getContactById: builder.query<Contact, number>({
      query: (id) => `/contacts/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Contact', id }],
    }),
    
    // Criar contato
    createContact: builder.mutation<Contact, Partial<Contact>>({
      query: (data) => ({
        url: '/contacts/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
    
    // Atualizar contato
    updateContact: builder.mutation<Contact, { id: number; data: Partial<Contact> }>({
      query: ({ id, data }) => ({
        url: `/contacts/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contact', id },
        'Contact',
      ],
    }),
    
    // Deletar contato
    deleteContact: builder.mutation<void, number>({
      query: (id) => ({
        url: `/contacts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
    
    // Registrar interação
    registerInteraction: builder.mutation<Contact, number>({
      query: (id) => ({
        url: `/contacts/${id}/registrar_interacao/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Contact', id },
        'Contact',
      ],
    }),
    
    // Obter estatísticas
    getContactStats: builder.query<ContactStats, void>({
      query: () => '/contacts/estatisticas/',
    }),
    
  }),
});

// ============================================
// EXPORTS
// ============================================

export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useRegisterInteractionMutation,
  useGetContactStatsQuery,
} = contactsApi;