import axios from 'axios';
import toast  from 'react-hot-toast';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ,
  withCredentials: true,               // send HttpOnly cookies
  timeout:         30000,
  headers:         { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

// ── Response interceptor ─────────────────────────────────────
let isRefreshing    = false;
let failedQueue     = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Token expired → try refresh once
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((e) => Promise.reject(e));
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr);
        // Force logout
        const { default: useAuthStore } = await import('../store/authStore');
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for errors (except 401 silent)
    const message = error.response?.data?.message;
    if (error.response?.status !== 401 && message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
