// src/store/slices/authSlice.ts - ✅ VERSÃO CORRIGIDA E LIMPA

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type User } from '../../services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('eleve_token'),
  isAuthenticated: !!localStorage.getItem('eleve_token'),
};

console.log('🔐 [AUTH SLICE] Estado inicial:', {
  hasToken: !!initialState.token,
  isAuthenticated: initialState.isAuthenticated,
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ Logout local
    logoutLocal: (state) => {
      console.log('🚪 [AUTH SLICE] Logout local executado');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('eleve_token');
    },
    
    // ✅ Setar usuário manualmente
    setUser: (state, action: PayloadAction<User>) => {
      console.log('👤 [AUTH SLICE] setUser chamado:', action.payload.username);
      state.user = action.payload;
    },

    // ✅ Hidratar auth do localStorage
    hydrateAuth: (state) => {
      const token = localStorage.getItem('eleve_token');
      console.log('💧 [AUTH SLICE] Hidratando auth:', { hasToken: !!token });
      
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  
  extraReducers: (builder) => {
    // ============================================
    // LOGIN
    // ============================================
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH SLICE] Login fulfilled:', action.payload.user.username);
        
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
          console.log('💾 [AUTH SLICE] Token salvo no localStorage');
        }
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (_state, action) => {
        console.error('❌ [AUTH SLICE] Login rejected:', action);
      }
    );
    
    // ============================================
    // REGISTER
    // ============================================
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH SLICE] Registro fulfilled:', action.payload.user.username);
        
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
          console.log('💾 [AUTH SLICE] Token salvo no localStorage');
        }
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (_state, action) => {
        console.error('❌ [AUTH SLICE] Registro rejected:', action);
      }
    );
    
    // ============================================
    // LOGOUT
    // ============================================
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        console.log('✅ [AUTH SLICE] Logout fulfilled');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('eleve_token');
      }
    );
    
    // ============================================
    // GET PROFILE
    // ============================================
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH SLICE] Profile carregado:', action.payload.username);
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Garantir que o token está setado
        if (!state.token) {
          const token = localStorage.getItem('eleve_token');
          if (token) {
            console.log('🔄 [AUTH SLICE] Restaurando token do localStorage');
            state.token = token;
          }
        }
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.warn('⚠️ [AUTH SLICE] Profile rejected:', action);
        
        const error = action.payload as any;
        
        // Se erro 401, limpar tudo
        if (error?.status === 401) {
          console.log('🧹 [AUTH SLICE] Erro 401 - Token inválido, limpando...');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('eleve_token');
        }
      }
    );
  },
});

export const { logoutLocal, setUser, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;