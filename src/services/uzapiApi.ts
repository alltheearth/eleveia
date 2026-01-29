// // src/services/uzapiApi.ts - API COM ACESSO CORRETO AO REDUX
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { RootState } from '../store';

// const API_URL = 'https://eleve.uazapi.com';

// // Interfaces baseadas nas respostas da API
// interface InstanceData {
//   id: string;
//   token: string;
//   status: 'connecting' | 'connected' | 'disconnected';
//   paircode: string;
//   qrcode: string;
//   name: string;
//   profileName: string;
//   profilePicUrl: string;
//   isBusiness: boolean;
//   plataform: string;
//   systemName: string;
//   owner: string;
//   current_presence: string;
//   lastDisconnect: string;
//   lastDisconnectReason: string;
//   created: string;
//   updated: string;
//   currentTime: string;
// }

// interface ConnectResponse {
//   connected: boolean;
//   instance: InstanceData;
//   jid: string | null;
//   loggedIn: boolean;
// }

// interface DisconnectResponse {
//   info: string;
//   instance: InstanceData;
//   response: string;
// }

// interface StatusResponse {
//   instance: InstanceData;
//   status: {
//     connected: boolean;
//     jid: string | null;
//     loggedIn: boolean;
//   };
// }

// export const uzapiApi = createApi({
//   reducerPath: 'uzapiApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_URL,
//     prepareHeaders: (headers, { getState }) => {
//       const state = getState() as RootState;
      
//       // CORRETO: Acessar o estado do schoolApi através das queries
//       const schoolApiState = state.schoolApi;
      
//       // Buscar a query específica de getSchools
//       const getSchoolsQueryState = schoolApiState?.queries?.['getSchools(undefined)'];
      
//       console.log('🔍 schoolApiState:', schoolApiState);
//       console.log('🔍 getSchoolsQueryState:', getSchoolsQueryState);
      
//       let token: string | null = null;
      
//       // Verificar se a query existe e tem dados
//       if (getSchoolsQueryState && getSchoolsQueryState.status === 'fulfilled') {
//         const data = getSchoolsQueryState.data as any;
//         const schools = data?.results;
        
//         console.log('🏫 Schools encontradas:', schools);
        
//         if (schools && schools.length > 0) {
//           token = schools[0].token_mensagens;
//           console.log('🔑 Token encontrado:', token);
//         } else {
//           console.warn('⚠️ Array de escolas vazio');
//         }
//       } else {
//         console.warn('⚠️ Query getSchools não encontrada ou não fulfilled');
//         console.log('Status da query:', getSchoolsQueryState?.status);
//       }
      
//       // Se encontrou o token, adicionar ao header
//       if (token && token.trim() !== '') {
//         headers.set(`token`,token);
//         console.log('✅ Header Authorization configurado');
//         console.log(token)
//       } else {
//         console.error('❌ Token não encontrado ou vazio');
//       }
      
//       headers.set('Content-Type', 'application/json');
//       headers.set('Accept', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['Instance'],
//   endpoints: (builder) => ({
//     // Verificar status da instância
//     getInstanceStatus: builder.query<StatusResponse, void>({
//       query: () => '/instance/status',
//       providesTags: ['Instance'],
//       transformResponse: (response: StatusResponse) => {
//         console.log('📊 Status da instância:', response);
//         return response;
//       },
//       transformErrorResponse: (response: any) => {
//         console.error('❌ Erro ao buscar status:', response);
//         if (response.status === 401) {
//           console.error('❌ Token inválido ou não configurado');
//         }
//         return response;
//       },
//     }),

//     // Conectar instância
//     connectInstance: builder.mutation<ConnectResponse, void>({
//       query: () => ({
//         url: '/instance/connect',
//         method: 'POST',
//         body: {},
//       }),
//       invalidatesTags: ['Instance'],
//       transformResponse: (response: ConnectResponse) => {
//         console.log('✅ Conectando instância:', response);
//         return response;
//       },
//       transformErrorResponse: (response: any) => {
//         console.error('❌ Erro ao conectar instância:', response);
//         return response;
//       },
//     }),

//     // Desconectar instância
//     disconnectInstance: builder.mutation<DisconnectResponse, void>({
//       query: () => ({
//         url: '/instance/disconnect',
//         method: 'POST',
//         body: {},
//       }),
//       invalidatesTags: ['Instance'],
//       transformResponse: (response: DisconnectResponse) => {
//         console.log('✅ Desconectando instância:', response);
//         return response;
//       },
//     }),
//   }),
// });

// export const {
//   useGetInstanceStatusQuery,
//   useConnectInstanceMutation,
//   useDisconnectInstanceMutation,
// } = uzapiApi;

// export type { InstanceData, ConnectResponse, DisconnectResponse, StatusResponse };