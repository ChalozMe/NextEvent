import { Link, useLocation } from 'react-router-dom';
import './RSVPResponsePage.css';

// US-06: Páginas estáticas de respuesta — Éxito, Rechazado, Enlace Caducado
// El tipo se lee desde la URL: /rsvp/success | /rsvp/declined | /rsvp/expired

type ResponseType = 'success' | 'declined' | 'expired';

interface PageConfig {
  icon: string;
  iconClass: string;
  title: string;
  subtitle: string;
  showDetail: boolean;
}

const CONFIG: Record<ResponseType, PageConfig> = {
  success: {
    icon: '✅',
    iconClass: 'rsvp-response__icon--success',
    title: '¡Asistencia confirmada!',
    subtitle: 'Tu respuesta ha sido registrada correctamente. ¡Te esperamos con mucho gusto!',
    showDetail: true,
  },
  declined: {
    icon: '😔',
    iconClass: 'rsvp-response__icon--declined',
    title: 'Respuesta registrada',
    subtitle: 'Lamentamos que no puedas asistir. Tu respuesta ha sido guardada correctamente.',
    showDetail: true,
  },
  expired: {
    icon: '⏰',
    iconClass: 'rsvp-response__icon--expired',
    // US-06: pantalla de Enlace Caducado cuando faltan < 48h para el evento
    title: 'Enlace caducado',
    subtitle: 'Este enlace ya no está disponible porque el evento ocurre en menos de 48 horas. Por favor, contacta al organizador directamente.',
    showDetail: false,
  },
};

// Datos del evento — en producción vendrían del backend via el token almacenado en sesión
const MOCK_EVENT_DETAIL = {
  name: 'Boda de Juan & Ana',
  date: '20 de Julio, 2025 — 4:00 PM',
  location: 'Hacienda Los Olivos, Pachacamac',
};

function RSVPResponsePage() {
  const { pathname } = useLocation();

  // Detecta el tipo desde la URL
  const segment = pathname.split('/').pop() as ResponseType;
  const type: ResponseType = ['success', 'declined', 'expired'].includes(segment)
    ? segment
    : 'expired';

  const cfg = CONFIG[type];

  return (
    <div className="rsvp-response">
      <div className="rsvp-response__card animate-scale-in">

        {/* Ícono de estado */}
        <div className={`rsvp-response__icon ${cfg.iconClass}`}>
          {cfg.icon}
        </div>

        <h1 className="rsvp-response__title">{cfg.title}</h1>
        <p className="rsvp-response__subtitle">{cfg.subtitle}</p>

        {/* Detalle del evento (no se muestra en enlace caducado) */}
        {cfg.showDetail && (
          <div className="rsvp-response__detail">
            <div className="rsvp-response__detail-row">
              <span>📅</span>
              <span><strong>{MOCK_EVENT_DETAIL.name}</strong></span>
            </div>
            <div className="rsvp-response__detail-row">
              <span>🕓</span>
              <span>{MOCK_EVENT_DETAIL.date}</span>
            </div>
            <div className="rsvp-response__detail-row">
              <span>📍</span>
              <span>{MOCK_EVENT_DETAIL.location}</span>
            </div>
          </div>
        )}

        {/* Acciones */}
        {type === 'expired' ? (
          <a
            href="mailto:evento@nextevent.com"
            className="rsvp-response__btn rsvp-response__btn--primary"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            ✉ Contactar organizador
          </a>
        ) : (
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
            Puedes cerrar esta ventana con seguridad.
          </p>
        )}
      </div>

      <div className="rsvp-response__footer">
        <span>Powered by </span>
        <Link to="/">NexEvent</Link>
        <span> · Tu respuesta es confidencial 🔒</span>
      </div>
    </div>
  );
}

export default RSVPResponsePage;
