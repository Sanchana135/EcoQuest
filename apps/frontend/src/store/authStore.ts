import { create } from 'zustand';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  avatarUrl?: string | null;
  level: number;
  xp: number;
  streakDays: number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('ecoquest_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('ecoquest_access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { tokens, user } = res.data.data;

      localStorage.setItem('ecoquest_access_token', tokens.accessToken);
      localStorage.setItem('ecoquest_user', JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Login failed. Please check credentials.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('ecoquest_access_token');
    localStorage.removeItem('ecoquest_user');
    set({ user: null, isAuthenticated: false, error: null });
  },

  loadSession: async () => {
    const token = localStorage.getItem('ecoquest_access_token');
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('ecoquest_access_token');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
