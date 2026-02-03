// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../services/apiSlice';
import authReducer from './slices/authSlice';



/**
 * Configuração da Redux Store
 */
export const store = configureStore({
  reducer: {
    // RTK Query
    [apiSlice.reducerPath]: apiSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    // [uzapiApi.reducerPath]: uzapiApi.reducer,
    
    // Apenas estado de autenticação (user, token)
    auth: authReducer,
    // ui: uiReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configurações para melhor performance
      serializableCheck: {
        // Ignora actions do RTK Query
        ignoredActions: [
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeMutation/pending',
          'api/executeMutation/fulfilled',
        ],
      },
    }).concat(apiSlice.middleware),
  
  // DevTools apenas em desenvolvimento
  devTools: import.meta.env.DEV,
});

// Setup dos listeners para refetch automático
setupListeners(store.dispatch);

// ============================================================================
// TYPES
// ============================================================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// HOOKS TIPADOS
// ============================================================================

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { baseApi } from '../services';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default store;