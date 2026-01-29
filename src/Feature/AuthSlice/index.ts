// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService, type LoginCredentials, type RegisterCredentials } from "../../services/authService";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name?: string;
//   last_name?: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: localStorage.getItem('eleve_token'),
//   loading: false,
//   error: null,
//   isAuthenticated: !!localStorage.getItem('eleve_token'),
// };

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials: LoginCredentials, { rejectWithValue }) => {
//     try {
//       return await authService.login(credentials);
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Erro ao fazer login');
//     }
//   }
// );

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData: RegisterCredentials, { rejectWithValue }) => {
//     try {
//       return await authService.register(userData);
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Erro ao registrar');
//     }
//   }
// );

// const AuthSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('eleve_token');
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Login
//     builder.addCase(loginUser.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(loginUser.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       state.error = null;
//     });
//     builder.addCase(loginUser.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//       state.isAuthenticated = false;
//     });

//     // Register
//     builder.addCase(registerUser.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(registerUser.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       state.error = null;
//     });
//     builder.addCase(registerUser.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//       state.isAuthenticated = false;
//     });
//   },
// });

// export const { logout, clearError } = AuthSlice.actions;
// export default AuthSlice.reducer;
