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
import RSVPConfirmPage from './pages/RSVPConfirmPage';
import RSVPResponsePage from './pages/RSVPResponsePage';
import GalleryPage from './pages/GalleryPage';
import RatingsPage from './pages/RatingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas RSVP públicas — sin autenticación (US-06) */}
          <Route path="/rsvp/:token" element={<RSVPConfirmPage />} />
          <Route path="/rsvp/success"  element={<RSVPResponsePage />} />
          <Route path="/rsvp/declined" element={<RSVPResponsePage />} />
          <Route path="/rsvp/expired"  element={<RSVPResponsePage />} />

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
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/ratings" element={<RatingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
