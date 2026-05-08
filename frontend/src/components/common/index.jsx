import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LogoGold from '../../assets/images/LogoIcon.png';

/* ════════════════════════════════════════════════════════════
   LOADING SPINNER
   fullScreen = true  → fixed black overlay with spinning logo
   fullScreen = false → inline centered spinner (inside pages)
════════════════════════════════════════════════════════════ */
export function LoadingSpinner({ fullScreen = false }) {

  /* ── Inline (non-fullscreen) ── */
  if (!fullScreen) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48,
      }}>
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2.5px solid var(--border)',
          borderTopColor: 'var(--text-primary)',
          animation: '_spin 0.75s linear infinite',
        }} />
      </div>
    );
  }

  /* ── Full-screen black loader ── */
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0,
    }}>
      <style>{`
        @keyframes _logoSpin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes _logoPulse {
          0%,100% { opacity: 0.9; }
          50%     { opacity: 0.5; }
        }
      `}</style>

      {/* Logo spinning */}
      <img
        src={LogoGold}
        alt="TaleXHub loading"
        style={{
          width: 72,
          height: 72,
          objectFit: 'contain',
          animation: '_logoSpin 1.4s linear infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PROTECTED ROUTE
   Waits for auth hydration before deciding to redirect.
════════════════════════════════════════════════════════════ */
export function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  if (isLoading)     return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

/* ════════════════════════════════════════════════════════════
   PUBLIC ROUTE
   Redirects authenticated users away from auth pages.
════════════════════════════════════════════════════════════ */
export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}