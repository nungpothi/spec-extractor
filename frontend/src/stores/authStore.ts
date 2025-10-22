import { create } from 'zustand';
import type { UserProfile, RegisterRequest, LoginRequest, UserRole } from '../types';
import { AuthService } from '../services';

interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  checkAuthStatus: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  token: AuthService.getToken(),
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Actions
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.register(data);
      set({ isLoading: false });
      // Auto-login after successful registration
      await get().login({ email: data.email, password: data.password });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const result = await AuthService.login(data);
      set({ 
        token: result.token,
        isAuthenticated: true,
        isLoading: false 
      });
      
      // Get user profile after login
      await get().getProfile();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    AuthService.logout();
    set({ 
      user: null,
      token: null,
      isAuthenticated: false,
      error: null 
    });
  },

  getProfile: async () => {
    if (!get().isAuthenticated) return;
    
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.getProfile();
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get profile',
        isLoading: false 
      });
      // If profile fetch fails, logout user
      get().logout();
    }
  },

  checkAuthStatus: () => {
    const token = AuthService.getToken();
    const isAuthenticated = AuthService.isAuthenticated();
    
    set({ token, isAuthenticated });
    
    if (isAuthenticated && !get().user) {
      get().getProfile();
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));