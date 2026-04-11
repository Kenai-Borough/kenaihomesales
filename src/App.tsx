import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import HomeDetailPage from './pages/HomeDetailPage';
import SellPage from './pages/SellPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="home/:id" element={<HomeDetailPage />} />
          <Route path="sell" element={<SellPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
