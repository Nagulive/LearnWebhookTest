import { create } from 'zustand';

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  login: (token: string, name: string, email: string, role: string) => void;
  logout: () => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  name: typeof window !== 'undefined' ? localStorage.getItem('name') : null,
  email: typeof window !== 'undefined' ? localStorage.getItem('email') : null,
  role: typeof window !== 'undefined' ? localStorage.getItem('role') : null,
  isHydrated: false,

  login: (token, name, email, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    set({ token, name, email, role });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    set({ token: null, name: null, email: null, role: null });
  },
}));

// Hydration fix for Next.js SSR
if (typeof window !== 'undefined') {
    useAuthStore.setState({ isHydrated: true });
}
