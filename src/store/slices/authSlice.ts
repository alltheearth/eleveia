// src/store/slices/authSlice.ts - CORRIGIDO
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService, type LoginCredentials, type RegisterCredentials } from '../../services/authService';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  perfil?: {
    id: number;
    escola: number;
    escola_nome: string;
    tipo: string;
    tipo_display: string;
    ativo: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('eleve_token'),
  isAuthenticated: !!localStorage.getItem('eleve_token'),
  isLoading: false,
  error: null,
};

// ==========================================
// ASYNC THUNKS
// ==========================================

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Iniciando login no Redux...');
      const response = await authService.login(credentials);
      console.log('✅ Login bem-sucedido no Redux:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Erro no login Redux:', error);
      return rejectWithValue(error.message || 'Erro ao fazer login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      console.log('📝 Iniciando registro no Redux...');
      const response = await authService.register(credentials);
      console.log('✅ Registro bem-sucedido no Redux:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Erro no registro Redux:', error);
      return rejectWithValue(error.message || 'Erro ao registrar');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('👤 Buscando perfil...');
      const user = await authService.getProfile();
      console.log('✅ Perfil carregado:', user);
      return user;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil:', error);
      return rejectWithValue(error.message || 'Erro ao buscar perfil');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    console.log('🚪 Fazendo logout...');
    await authService.logout();
  }
);

// ==========================================
// SLICE
// ==========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('eleve_token');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('⏳ Login pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('❌ Login rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        console.log('⏳ Register pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('✅ Register fulfilled:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error('❌ Register rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('eleve_token');
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        console.log('✅ Logout fulfilled');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, logoutLocal } = authSlice.actions;
export default authSlice.reducer;