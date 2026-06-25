import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard', enabled: true },
  { to: '/events/new', icon: '📅', label: 'Eventos', enabled: true },
  { to: '/chronogram', icon: '✨', label: 'Cronograma IA', enabled: true },
  { to: '/venues', icon: '📍', label: 'Locales', enabled: true },
  { to: '/guests', icon: '👥', label: 'Invitados RSVP', enabled: true },
  { to: '/gallery', icon: '🖼️', label: 'Galería', enabled: false },
  { to: '/settings', icon: '⚙️', label: 'Configuración', enabled: false },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const location = useLocation();

  let aiTitle = '✨ Planificación Inteligente';
  let aiDesc = 'Deja que nuestra IA te ayude a organizar el evento perfecto.';
  let aiBtn = 'Ver sugerencias';

  if (location.pathname === '/events/new') {
    aiTitle = '¿Necesitas ayuda?';
    aiDesc = 'Nuestro asistente IA puede guiarte en la planificación de tu evento.';
    aiBtn = '✨ Abrir asistente';
  } else if (location.pathname === '/chronogram') {
    aiTitle = '✨ IA Planificadora';
    aiDesc = 'He generado este cronograma basado en el tipo de evento, fecha y tiempo disponible.';
    aiBtn = 'Regenerar cronograma';
  } else if (location.pathname.startsWith('/venues')) {
    aiTitle = '✨ ¿Necesitas ayuda?';
    aiDesc = 'Nuestra IA puede recomendar el lugar perfecto para tu evento.';
    aiBtn = 'Buscar con IA';
  } else if (location.pathname === '/guests') {
    aiTitle = '✨ Gestión inteligente';
    aiDesc = 'La IA puede sugerirte la distribución de mesas y detectar invitados sin confirmar.';
    aiBtn = 'Optimizar mesas';
  }

  return (
    <>
      <button 
        className="mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar-wrapper ${mobileOpen ? 'sidebar-wrapper--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">✦</div>
          <div className="sidebar-logo-text">NexEvent</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            item.enabled ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive && item.to === '/' ? 'sidebar-link--active' : isActive ? 'sidebar-link--active' : ''}`}
                end={item.to === '/'}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ) : (
              <div key={item.to} className="sidebar-link sidebar-link--disabled">
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </div>
            )
          ))}
        </nav>

        <div className="sidebar-ai-banner">
          <div className="sidebar-ai-title">
            {aiTitle}
          </div>
          <div className="sidebar-ai-desc">
            {aiDesc}
          </div>
          <button className="sidebar-ai-btn">{aiBtn}</button>
        </div>

        <div className="sidebar-user" onClick={handleLogout} title="Cerrar sesión">
          <div className="sidebar-avatar">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.fullName || 'María López'}</span>
            <span className="sidebar-user-role">Organizador</span>
          </div>
          <div className="sidebar-user-chevron">⌄</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
