// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type User } from '../../services/api/authApi';

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
 * Slice de autenticação
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
  
  // Reagir aos resultados das mutations/queries do RTK Query
  extraReducers: (builder) => {
    // Login bem-sucedido
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    );
    
    // Registro bem-sucedido
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    );
    
    // Logout bem-sucedido
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    );
    
    // Profile carregado
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    
    // Profile falhou (token inválido)
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('eleve_token');
      }
    );
  },
});

export const { logoutLocal, setUser } = authSlice.actions;
export default authSlice.reducer;