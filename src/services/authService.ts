// src/services/authService.ts - CORRIGIDO E SIMPLIFICADO
import axios, { type AxiosInstance } from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

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

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class AuthService {
  private api: AxiosInstance;
  private readonly TOKEN_KEY = 'eleve_token';
  private readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para respostas
    this.api.interceptors.response.use(
      (response) => {
        console.log('📥 Response Success:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Login - enviando para:', `${this.API_URL}/auth/login/`);
      console.log('📨 Credenciais:', { username: credentials.username });

      const response = await this.api.post<AuthResponse>('/auth/login/', credentials);

      console.log('✅ Login bem-sucedido:', {
        token: response.data.token.substring(0, 20) + '...',
        user: response.data.user.username,
      });

      // Salvar token
      this.setToken(response.data.token);

      return response.data;
    } catch (error) {
      console.error('🚨 Login failed:', error);
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('📝 Register - enviando para:', `${this.API_URL}/auth/registro/`);

      const response = await this.api.post<AuthResponse>('/auth/registro/', userData);

      console.log('✅ Register bem-sucedido:', response.data.user.username);

      // Salvar token
      this.setToken(response.data.token);

      return response.data;
    } catch (error) {
      console.error('🚨 Register failed:', error);
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logout...');
      await this.api.post('/auth/logout/');
    } catch (error) {
      console.error('⚠️ Erro ao fazer logout:', error);
    } finally {
      this.removeToken();
    }
  }

  async getProfile(): Promise<User> {
    try {
      console.log('👤 Buscando perfil...');
      const response = await this.api.get<User>('/auth/perfil/');
      console.log('✅ Perfil carregado:', response.data.username);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      throw this.handleError(error);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('💾 Token salvo');
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('🗑️ Token removido');
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data;

      let message = 'Erro desconhecido';

      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.detail) {
        message = data.detail;
      } else if (data?.error) {
        message = data.error;
      } else if (data?.non_field_errors?.[0]) {
        message = data.non_field_errors[0];
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
          message = data[firstKey][0];
        } else if (typeof data[firstKey] === 'string') {
          message = data[firstKey];
        }
      }

      return {
        message,
        status,
        details: data,
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      status: 500,
    };
  }
}

export const authService = new AuthService();
export type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiError,
};