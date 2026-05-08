import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import useThemeStore from './store/themeStore';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 } } });

useThemeStore.getState().init(); // ← ADD THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl', fontSize: 14, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);