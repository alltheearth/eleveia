// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../services/api/baseApi';
import authReducer from './slices/authSlice';

/**
 * Store Redux centralizado
 * Usa RTK Query para todas as chamadas de API
 */
const store = configureStore({
  reducer: {
    // API (RTK Query)
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Apenas estado de autenticação (user, token)
    auth: authReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;