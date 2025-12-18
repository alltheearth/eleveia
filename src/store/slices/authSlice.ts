// src/store/slices/authSlice.ts - ✅ CORRIGIDO
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

/**
 * ✅ Slice de autenticação
 * Gerencia apenas o estado de user e token
 * As chamadas de API são feitas via RTK Query
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
      localStorage.removeItem('eleve_token');
    },
    
    // Setar user manualmente (se necessário)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  
  // ✅ Reagir aos resultados das mutations/queries do RTK Query
  extraReducers: (builder) => {
    // ✅ Login bem-sucedido
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log('✅ Login fulfilled - Atualizando state:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Garantir que o token está no localStorage
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
        }
      }
    );
    
    // ✅ Registro bem-sucedido
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        console.log('✅ Registro fulfilled - Atualizando state:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Garantir que o token está no localStorage
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
        }
      }
    );
    
    // ✅ Logout bem-sucedido
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        console.log('✅ Logout fulfilled - Limpando state');
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
        console.log('✅ Profile carregado:', action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    
    // ✅ Profile falhou (token inválido)
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.error('❌ Profile rejected:', action);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('eleve_token');
      }
    );

    // ✅ Login falhou
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        console.error('❌ Login rejected:', action);
        // Não limpa o state em caso de erro de login
        // (pode ser só senha errada)
      }
    );

    // ✅ Registro falhou
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        console.error('❌ Registro rejected:', action);
        // Não limpa o state em caso de erro de registro
      }
    );
  },
});

export const { logoutLocal, setUser } = authSlice.actions;
export default authSlice.reducer;