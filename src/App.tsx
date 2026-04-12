
import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import { KenaiAuthProvider } from './contexts/KenaiAuthContext';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';
import DashboardPage from './pages/DashboardPage';
import HomeDetailPage from './pages/HomeDetailPage';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFoundPage from './pages/NotFoundPage';
import { KenaiAccount } from './pages/auth/KenaiAccount';
import { KenaiSignIn } from './pages/auth/KenaiSignIn';
import { KenaiSignUp } from './pages/auth/KenaiSignUp';
import SellPage from './pages/SellPage';

function App() {
  return (
    <ErrorBoundary>
      <KenaiAuthProvider>
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </KenaiAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
