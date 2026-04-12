import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { InstallPrompt } from './components/InstallPrompt';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import { KenaiAuthProvider } from './contexts/KenaiAuthContext';
import { useAnalytics } from './hooks/useAnalytics';

const AdminPage = lazy(() => import('./pages/AdminPage'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HomeDetailPage = lazy(() => import('./pages/HomeDetailPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const KenaiAccount = lazy(async () => ({ default: (await import('./pages/auth/KenaiAccount')).KenaiAccount }));
const KenaiSignIn = lazy(async () => ({ default: (await import('./pages/auth/KenaiSignIn')).KenaiSignIn }));
const KenaiSignUp = lazy(async () => ({ default: (await import('./pages/auth/KenaiSignUp')).KenaiSignUp }));
const SellPage = lazy(() => import('./pages/SellPage'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const DMCA = lazy(() => import('./pages/legal/DMCA'));
const AcceptableUse = lazy(() => import('./pages/legal/AcceptableUse'));
const RealEstateDisclaimer = lazy(() => import('./pages/legal/RealEstateDisclaimer'));
const FairHousing = lazy(() => import('./pages/legal/FairHousing'));

function AppRoutes() {
  useAnalytics();

  return (
    <>
      <a href="#main-content" className="sr-only absolute left-4 top-4 z-[80] rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only">
        Skip to main content
      </a>
      <InstallPrompt />
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="home/:id" element={<HomeDetailPage />} />
            <Route path="sell" element={<SellPage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="sign-in" element={<KenaiSignIn />} />
            <Route path="signin" element={<KenaiSignIn />} />
            <Route path="login" element={<KenaiSignIn />} />
            <Route path="sign-up" element={<KenaiSignUp />} />
            <Route path="signup" element={<KenaiSignUp />} />
            <Route path="account" element={<ProtectedRoute><KenaiAccount /></ProtectedRoute>} />
            <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/acceptable-use" element={<AcceptableUse />} />
            <Route path="/real-estate-disclaimer" element={<RealEstateDisclaimer />} />
            <Route path="/fair-housing" element={<FairHousing />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <KenaiAuthProvider>
        <AppRoutes />
      </KenaiAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
