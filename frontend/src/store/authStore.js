import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password, rememberMe });
          set({ user: data.data.user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg   = err.response?.data?.message || 'فشل تسجيل الدخول';
          const extra = err.response?.data || {};
          set({ isLoading: false, error: msg });
          return { success: false, message: msg, ...extra };
        }
      },

      // register: async (payload) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const { data } = await api.post('/auth/register', payload);
      //     set({ isLoading: false });
      //     // ✅ FIX: log in dev to confirm shape, guard against undefined
      //     const userId = data?.data?.userId;
      //     const email  = data?.data?.email;
      //     if (!userId) {
      //       console.error('Register response missing userId:', data);
      //       return { success: false, message: 'Server error: missing userId' };
      //     }
      //     return { success: true, userId, email };
      //   } catch (err) {
      //     const msg = err.response?.data?.message || 'فشل إنشاء الحساب';
      //     set({ isLoading: false, error: msg });
      //     return { success: false, message: msg };
      //   }
      // },

      // ✅ FIX: purpose is now sent in the API body
      register: async (payload) => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await api.post('/auth/register', payload);
    set({ isLoading: false });

    // ✅ FIX: backend may return `id` not `userId` — handle both
    const userId = data?.data?.userId ?? data?.data?.id ?? data?.data?.user?.id;
    const email  = data?.data?.email  ?? data?.data?.user?.email ?? payload.email;

    console.log('Register raw response:', JSON.stringify(data)); // remove after confirming

    if (!userId) {
      console.error('Could not find userId in response:', data);
      return { success: false, message: 'Server error: missing userId' };
    }

    return { success: true, userId, email };
  } catch (err) {
    const msg = err.response?.data?.message || 'فشل إنشاء الحساب';
    set({ isLoading: false, error: msg });
    return { success: false, message: msg };
  }
},
      verifyOtp: async (userId, otp, purpose = 'email_verify') => {
        set({ isLoading: true });
        try {
          await api.post('/auth/verify-otp', { userId, otp, purpose });
          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'رمز غير صحيح' };
        }
      },

      // ✅ FIX: purpose is now sent in the API body
      resendOtp: async (userId, purpose = 'email_verify') => {
        try {
          await api.post('/auth/resend-otp', { userId, purpose });
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
          return { success: true, userId: data.data?.userId };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      resetPassword: async (userId, otp, newPassword) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/reset-password', { userId, otp, newPassword });
          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch { /* silent */ }
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),
      clearError:  ()       => set({ error: null }),
    }),
    {
      name:    'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;