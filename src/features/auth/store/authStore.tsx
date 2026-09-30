/* import {create} from 'zustand';
import {User} from 'firebase/auth';

type AuthMode = 'login' | 'register'

interface AuthState {
    user: User | null;
    isInitializing: boolean;
    mode: AuthMode;
    setUser: (user: User | null) => void;
    setInitializing: (val: boolean) => void;
    setMode: (mode: AuthMode) => void;
}

export const useAuthStore = create<AuthState> ((set) => ({
    user: null,
    isInitializing: true,
    mode: 'login',
    setUser: (user) => set({ user }),
    setInitializing: (val) => set({ isInitializing: val }),
    setMode: (mode) => set({ mode }),
}))

*/


import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

type AuthMode = 'login' | 'register';

interface AuthState {
  user: User | null;
  isInitializing: boolean;
  mode: AuthMode;
  setUser: (user: User | null) => void;
  setInitializing: (val: boolean) => void;
  setMode: (mode: AuthMode) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  mode: 'login',
  setUser: (user) => set({ user }),
  setInitializing: (val) => set({ isInitializing: val }),
  setMode: (mode) => set({ mode }),
}));