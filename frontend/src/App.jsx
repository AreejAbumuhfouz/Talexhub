import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner, ProtectedRoute, PublicRoute } from './components/common';

// ✅ Stage 1+2 — DONE
// const LandingPage   = lazy(() => import('./pages/LandingPage'));
// const LoginPage     = lazy(() => import('./pages/auth/LoginPage'));
// const RegisterPage  = lazy(() => import('./pages/auth/RegisterPage'));
// const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
// const ProfilePage   = lazy(() => import('./pages/dashboard/ProfilePage'));
// const SettingsPage  = lazy(() => import('./pages/dashboard/SettingsPage'));
// const PrivacyPage   = lazy(() => import('./pages/Privacy'));
// const TermsPage     = lazy(() => import('./pages/Terms'));
// const SupportPage   = lazy(() => import('./pages/Support'));
// const CookiesPage   = lazy(() => import('./pages/Cookies'));
// const FAQPage       = lazy(() => import('./pages/FAQ'));
const ComingSoon    = lazy(() => import('./pages/ComingSoon'));
// const GoogleCallbackPage = lazy(() => import('./pages/auth/GoogleCallbackPage'));

// // ✅ Stage 3 — CV + AI
// const CVPage      = lazy(() => import('./pages/dashboard/CVPage'));
// const PricingPage = lazy(() => import('./pages/PricingPage'));

// // Public info pages
// const PublicJobs  = lazy(() => import('./pages/JobsPage'));
// const PublicAbout = lazy(() => import('./pages/AboutPage'));

// // ✅ Stage 5 — Company
// const CompanyRegisterPage = lazy(() => import('./pages/Company/CompanyRegisterPage'));
// const CompanyDashboard    = lazy(() => import('./pages/Company/CompanyDashboard'));
// const CompanyProfilePage  = lazy(() => import('./pages/Company/CompanyProfilePage'));
// const CompanyMembersPage  = lazy(() => import('./pages/Company/CompanyMembersPage'));

const NotFound = lazy(() => import('./pages/NotFound'));

// export const getDashboardByRole = (role) => {
//   switch (role) {
//     case 'admin':
//     case 'support':  return '/admin';
//     case 'company':  return '/company/dashboard';
//     default:         return '/dashboard';
//   }
// };

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>

        {/* ── Public ──────────────────────────────────────── */}
        {/* <Route path="/"         element={<LandingPage />} /> */}
        <Route path="/"         element={<ComingSoon />} />
        {/* <Route path="/jobs"     element={<PublicJobs />} />
        <Route path="/jobs/:id" element={<PublicJobs />} />
        <Route path="/about"    element={<PublicAbout />} />
        <Route path="/pricing"  element={<PricingPage />} />
        <Route path="/privacy"  element={<PrivacyPage />} />
        <Route path="/terms"    element={<TermsPage />} />
        <Route path="/support"  element={<SupportPage />} />
        <Route path="/cookies"  element={<CookiesPage />} />
        <Route path="/faq"      element={<FAQPage />} /> */}

        {/* ── Auth ────────────────────────────────────────── */}
        {/*
          ⚠️  /register is NOT wrapped in PublicRoute.
          PublicRoute redirects authenticated users away, which also
          kills the OTP step (step='otp') that lives inside RegisterPage —
          because the component gets unmounted before the user sees it.
          RegisterPage handles its own "already logged in" case via
          the OTP flow: after OTP success it navigates to /login.
          If you want to block logged-in users from /register,
          do it inside RegisterPage itself using useAuthStore, not here.
        */}
        {/* <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<RegisterPage />} /> */}

        {/*
          Google OAuth callback — intentionally NOT wrapped in PublicRoute.
          Backend redirects here after Google login (cookie already set).
          This page syncs the Zustand store then redirects to /dashboard.
        */}
        {/* <Route path="/auth/callback" element={<GoogleCallbackPage />} /> */}

        {/* ── User Dashboard ──────────────────────────────── */}
        {/* <Route path="/dashboard"          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/cvs"      element={<ProtectedRoute><CVPage /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} /> */}

        {/* ── Company ─────────────────────────────────────── */}
        {/* <Route path="/company/register"
          element={<CompanyRegisterPage />} />
        <Route path="/company/dashboard"
          element={<ProtectedRoute roles={['company','admin']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/profile"
          element={<ProtectedRoute roles={['company','admin']}><CompanyProfilePage /></ProtectedRoute>} />
        <Route path="/company/members"
          element={<ProtectedRoute roles={['company','admin']}><CompanyMembersPage /></ProtectedRoute>} /> */}

        {/* ── 404 ─────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}