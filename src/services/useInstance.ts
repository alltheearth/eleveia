// src/services/uzapiApi.ts - ✅ CORRIGIDO COM LOGS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_URL = 'https://eleve.uazapi.com';

// Interfaces baseadas nas respostas da API
interface InstanceData {
  id: string;
  token: string;
  status: 'connecting' | 'connected' | 'disconnected';
  paircode: string;
  qrcode: string;
  name: string;
  profileName: string;
  profilePicUrl: string;
  isBusiness: boolean;
  plataform: string;
  systemName: string;
  owner: string;
  current_presence: string;
  lastDisconnect: string;
  lastDisconnectReason: string;
  created: string;
  updated: string;
  currentTime: string;
}

interface ConnectResponse {
  connected: boolean;
  instance: InstanceData;
  jid: string | null;
  loggedIn: boolean;
}

interface DisconnectResponse {
  info: string;
  instance: InstanceData;
  response: string;
}

interface StatusResponse {
  instance: InstanceData;
  status: {
    connected: boolean;
    jid: string | null;
    loggedIn: boolean;
  };
}

export const uzapiApi = createApi({
  reducerPath: 'uzapiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      
      console.log('📋 [UZAPI] Estado completo do Redux:', state);
      
      // ✅ CORRIGIDO: Acessar schoolApi do estado
      const schoolApiState = state.api;
      
      console.log('🔍 [UZAPI] schoolApiState:', schoolApiState);
      
      // Buscar a query específica de getSchools
      const getSchoolsQueryState = schoolApiState?.queries?.['getSchools({})'];
      
      console.log('🔍 [UZAPI] getSchoolsQueryState:', getSchoolsQueryState);
      
      let token: string | null = null;
      
      // Verificar se a query existe e tem dados
      if (getSchoolsQueryState && getSchoolsQueryState.status === 'fulfilled') {
        const data = getSchoolsQueryState.data as any;
        const schools = data?.results;
        
        console.log('🏫 [UZAPI] Schools encontradas:', schools);
        
        if (schools && schools.length > 0) {
          token = schools[0].token_mensagens;
          console.log('🔑 [UZAPI] Token encontrado:', token ? `${token.substring(0, 10)}...` : 'VAZIO');
        } else {
          console.warn('⚠️ [UZAPI] Array de escolas vazio');
        }
      } else {
        console.warn('⚠️ [UZAPI] Query getSchools não encontrada ou não fulfilled');
        console.log('Status da query:', getSchoolsQueryState?.status);
      }
      
      // Se encontrou o token, adicionar ao header
      if (token && token.trim() !== '') {
        headers.set('token', token);
        console.log('✅ [UZAPI] Header token configurado');
      } else {
        console.error('❌ [UZAPI] Token não encontrado ou vazio');
      }
      
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      console.log('📤 [UZAPI] Headers finais:', Object.fromEntries(headers.entries()));
      
      return headers;
    },
  }),
  tagTypes: ['Instance'],
  endpoints: (builder) => ({
    // Verificar status da instância
    getInstanceStatus: builder.query<StatusResponse, void>({
      query: () => {
        console.log('🔄 [UZAPI] Buscando status da instância...');
        return '/instance/status';
      },
      providesTags: ['Instance'],
      transformResponse: (response: StatusResponse) => {
        console.log('✅ [UZAPI] Status da instância:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ [UZAPI] Erro ao buscar status:', response);
        if (response.status === 401) {
          console.error('❌ [UZAPI] Token inválido ou não configurado');
        }
        return response;
      },
    }),

    // Conectar instância
    connectInstance: builder.mutation<ConnectResponse, void>({
      query: () => {
        console.log('🔄 [UZAPI] Conectando instância...');
        return {
          url: '/instance/connect',
          method: 'POST',
          body: {},
        };
      },
      invalidatesTags: ['Instance'],
      transformResponse: (response: ConnectResponse) => {
        console.log('✅ [UZAPI] Instância conectada:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ [UZAPI] Erro ao conectar instância:', response);
        return response;
      },
    }),

    // Desconectar instância
    disconnectInstance: builder.mutation<DisconnectResponse, void>({
      query: () => {
        console.log('🔄 [UZAPI] Desconectando instância...');
        return {
          url: '/instance/disconnect',
          method: 'POST',
          body: {},
        };
      },
      invalidatesTags: ['Instance'],
      transformResponse: (response: DisconnectResponse) => {
        console.log('✅ [UZAPI] Instância desconectada:', response);
        return response;
      },
    }),
  }),
});

export const {
  useGetInstanceStatusQuery,
  useConnectInstanceMutation,
  useDisconnectInstanceMutation,
} = uzapiApi;

export type { InstanceData, ConnectResponse, DisconnectResponse, StatusResponse };