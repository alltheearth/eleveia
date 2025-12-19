// src/store/slices/authSlice.ts - ✅ CORRIGIDO COM TOKEN
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type User } from '../../services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ✅ Carregar token do localStorage na inicialização
const tokenFromStorage = localStorage.getItem('eleve_token');

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  isLoading: false,
};

/**
 * ✅ Slice de autenticação
 * Gerencia user, token e estado de autenticação
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout local (sem chamada de API)
    logoutLocal: (state) => {
      console.log('🚪 [AUTH] Logout local - Limpando estado');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('eleve_token');
    },
    
    // Setar user manualmente (se necessário)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // ✅ Setar token manualmente
    setToken: (state, action: PayloadAction<string>) => {
      console.log('🔑 [AUTH] Setando token manualmente');
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('eleve_token', action.payload);
    },
  },
  
  // ✅ Reagir aos resultados das mutations/queries do RTK Query
  extraReducers: (builder) => {
    // ============================================
    // LOGIN
    // ============================================
    builder.addMatcher(
      authApi.endpoints.login.matchPending,
      (state) => {
        console.log('🔄 [AUTH] Login pending...');
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH] Login fulfilled:', action.payload);
        
        const { user, token } = action.payload;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        
        // ✅ CRÍTICO: Salvar token no localStorage
        if (token) {
          localStorage.setItem('eleve_token', token);
          console.log('💾 [AUTH] Token salvo no localStorage:', token.substring(0, 10) + '...');
        } else {
          console.error('❌ [AUTH] Token não retornado pela API!');
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        console.error('❌ [AUTH] Login rejected:', action);
        state.isLoading = false;
        state.isAuthenticated = false;
      }
    );
    
    // ============================================
    // REGISTRO
    // ============================================
    builder.addMatcher(
      authApi.endpoints.register.matchPending,
      (state) => {
        console.log('🔄 [AUTH] Registro pending...');
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH] Registro fulfilled:', action.payload);
        
        const { user, token } = action.payload;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        
        // ✅ Salvar token no localStorage
        if (token) {
          localStorage.setItem('eleve_token', token);
          console.log('💾 [AUTH] Token salvo no localStorage (registro):', token.substring(0, 10) + '...');
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        console.error('❌ [AUTH] Registro rejected:', action);
        state.isLoading = false;
      }
    );
    
    // ============================================
    // LOGOUT
    // ============================================
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        console.log('✅ [AUTH] Logout fulfilled - Limpando state');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('eleve_token');
      }
    );
    
    // ============================================
    // PROFILE
    // ============================================
    builder.addMatcher(
      authApi.endpoints.getProfile.matchPending,
      (state) => {
        console.log('🔄 [AUTH] Buscando perfil...');
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH] Profile carregado:', action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.error('❌ [AUTH] Profile rejected - Token inválido:', action);
        
        // ✅ Token inválido - limpar tudo
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('eleve_token');
        
        console.log('🧹 [AUTH] Token inválido - localStorage limpo');
      }
    );
  },
});

export const { logoutLocal, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;