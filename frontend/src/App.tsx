import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ChronogramPage from './pages/ChronogramPage';
import VenueCatalogPage from './pages/VenueCatalogPage';
import VenueDetailPage from './pages/VenueDetailPage';
import GuestManagementPage from './pages/GuestManagementPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with sidebar layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/events/new" element={<CreateEventPage />} />
            <Route path="/chronogram" element={<ChronogramPage />} />
            <Route path="/venues" element={<VenueCatalogPage />} />
            <Route path="/venues/:id" element={<VenueDetailPage />} />
            <Route path="/guests" element={<GuestManagementPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
