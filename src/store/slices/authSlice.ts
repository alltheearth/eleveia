// src/store/slices/authSlice.ts - ✅ SOLUÇÃO FINAL
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('eleve_token');
      console.log('🧹 [AUTH] Logout local - localStorage limpo');
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    // ✅ Login bem-sucedido
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH] Login fulfilled:', action.payload);
        
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
          console.log('💾 [AUTH] Token salvo:', action.payload.token.substring(0, 20) + '...');
        }
      }
    );
    
    // ✅ Registro bem-sucedido
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        console.log('✅ [AUTH] Registro fulfilled:', action.payload);
        
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        if (action.payload.token) {
          localStorage.setItem('eleve_token', action.payload.token);
          console.log('💾 [AUTH] Token salvo:', action.payload.token.substring(0, 20) + '...');
        }
      }
    );
    
    // ✅ Logout bem-sucedido
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        console.log('✅ [AUTH] Logout fulfilled');
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
        console.log('✅ [AUTH] Profile carregado:', action.payload);
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    
    // ✅ Profile falhou - MAS SÓ LIMPA SE REALMENTE FOR ERRO DE AUTH
    builder.addMatcher(
      authApi.endpoints.getProfile.matchRejected,
      (state, action) => {
        console.warn('⚠️ [AUTH] Profile rejected:', action);
        
        // ✅ IMPORTANTE: Só limpa se tiver user (ou seja, não é a primeira tentativa)
        // Ou se o erro for explicitamente 401
        const error = action.payload as any;
        
        if (error?.status === 401) {
          console.log('🧹 [AUTH] Erro 401 - Token inválido, limpando...');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('eleve_token');
        } else {
          console.log('ℹ️ [AUTH] Erro ao buscar perfil, mas mantendo token');
        }
      }
    );

    // ✅ Login falhou
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        console.error('❌ [AUTH] Login rejected:', action);
      }
    );

    // ✅ Registro falhou
    builder.addMatcher(
      authApi.endpoints.register.matchRejected,
      (state, action) => {
        console.error('❌ [AUTH] Registro rejected:', action);
      }
    );
  },
});

export const { logoutLocal, setUser } = authSlice.actions;
export default authSlice.reducer;