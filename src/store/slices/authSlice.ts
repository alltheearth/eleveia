// src/store/slices/authSlice.ts - ✅ VERSÃO COM LOGS DE DEBUG

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

// ✅ Log inicial
console.log('🔐 [AUTH SLICE] Estado inicial:', {
  hasToken: !!initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  token: initialState.token?.substring(0, 20) + '...',
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal: (state) => {
      console.log('🚪 [AUTH SLICE] Logout local executado');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('eleve_token');
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      console.log('👤 [AUTH SLICE] setUser chamado:', action.payload.username);
      state.user = action.payload;
    },

    // ✅ NOVO: Action para forçar hidratação do estado
    hydrateAuth: (state) => {
      const token = localStorage.getItem('eleve_token');
      console.log('💧 [AUTH SLICE] Hidratando auth:', {
        hasToken: !!token,
      });
      
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  
  extraReducers: (builder) => {
    // ✅ Login bem-sucedido
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
    
    // ✅ Registro bem-sucedido
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
    
    // ✅ Logout bem-sucedido
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
    
    // ✅ Profile carregado
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH SLICE] Profile carregado:', action.payload.username);
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // ✅ IMPORTANTE: Garantir que o token está setado
        if (!state.token) {
          const token = localStorage.getItem('eleve_token');
          if (token) {
            console.log('🔄 [AUTH SLICE] Restaurando token do localStorage');
            state.token = token;
          }
        }
      }
    );
    
    // ✅ Profile falhou
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.warn('⚠️ [AUTH SLICE] Profile rejected:', action);
        
        const error = action.payload as any;
        
        if (error?.status === 401) {
          console.log('🧹 [AUTH SLICE] Erro 401 - Token inválido, limpando...');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('eleve_token');
        } else {
          console.log('ℹ️ [AUTH SLICE] Erro ao buscar perfil, mas mantendo token');
        }
      }
    );

    // ✅ Login falhou
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (_state, action) => {
        console.error('❌ [AUTH SLICE] Login rejected:', action);
      }
    );

    // ✅ Registro falhou
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (_state, action) => {
        console.error('❌ [AUTH SLICE] Registro rejected:', action);
      }
    );
  },
});

export const { logoutLocal, setUser, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;