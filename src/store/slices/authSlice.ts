// src/store/slices/authSlice.ts - ✅ CORRIGIDO COM isLoading
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type User } from '../../services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ ADICIONADO
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('eleve_token'),
  isAuthenticated: !!localStorage.getItem('eleve_token'),
  isLoading: false, // ✅ ADICIONADO
};

/**
 * ✅ Slice de autenticação
 * Gerencia user, token e loading states
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout local (sem chamada de API)
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('eleve_token');
    },
    
    // Setar user manualmente (se necessário)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // ✅ ADICIONADO - Setar loading manualmente se necessário
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
        console.log('🔄 Login pending...');
        state.isLoading = true;
        state.error = null;
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log('✅ Login fulfilled - Atualizando state:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        
        // Garantir que o token está no localStorage
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        console.error('❌ Login rejected:', action);
        state.isLoading = false;
        state.isAuthenticated = false;
      }
    );
    
    // ============================================
    // REGISTER
    // ============================================
    builder.addMatcher(
      authApi.endpoints.register.matchPending,
      (state) => {
        console.log('🔄 Register pending...');
        state.isLoading = true;
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        console.log('✅ Registro fulfilled - Atualizando state:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        
        // Garantir que o token está no localStorage
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
        }
      }
    );

    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        console.error('❌ Registro rejected:', action);
        state.isLoading = false;
      }
    );
    
    // ============================================
    // LOGOUT
    // ============================================
    builder.addMatcher(
      authApi.endpoints.logout.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        console.log('✅ Logout fulfilled - Limpando state');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('eleve_token');
      }
    );

    builder.addMatcher(
      authApi.endpoints.logout.matchRejected,
      (state) => {
        // Mesmo com erro, limpar tudo
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('eleve_token');
      }
    );
    
    // ============================================
    // GET PROFILE
    // ============================================
    builder.addMatcher(
      authApi.endpoints.getProfile.matchPending,
      (state) => {
        console.log('🔄 Buscando perfil...');
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        console.log('✅ Profile carregado:', action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.error('❌ Profile rejected - Token inválido:', action);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('eleve_token');
      }
    );
  },
});

export const { logoutLocal, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;