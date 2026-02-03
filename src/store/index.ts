// src/store/index.ts - ✅ STORE PRINCIPAL UNIFICADA E CORRIGIDA
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/api/baseApi';
import authReducer from './slices/authSlice';

/**
 * ============================================
 * REDUX STORE CONFIGURATION
 * ============================================
 * Store centralizada com RTK Query
 */
const store = configureStore({
  reducer: {
    // ✅ API (RTK Query) - ÚNICA baseApi
    [baseApi.reducerPath]: baseApi.reducer,
    
    // ✅ Auth Slice - Gerencia user e token
    auth: authReducer,
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
    }).concat(baseApi.middleware), // ✅ Apenas baseApi middleware
  
  // DevTools apenas em desenvolvimento
  devTools: import.meta.env.DEV,
});

// ✅ Setup dos listeners para refetch automático
setupListeners(store.dispatch);

// ============================================
// TYPES
// ============================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// HOOKS TIPADOS
// ============================================
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================
// DEFAULT EXPORT
// ============================================
export default store;