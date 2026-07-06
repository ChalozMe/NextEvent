import { useNavigate, useParams } from 'react-router-dom';
import type { EventType } from '../types';
import './RSVPConfirmPage.css';

// ─── Templates visuales por tipo de evento ──────────────────
// Cada tipo tiene su paleta y textos propios
const TEMPLATES: Record<EventType, {
  bannerClass: string;
  decoration: string;
  title: string;
  subtitle: string;
  nameStyle: string;
  separator: string;
  accentColor: string;
}> = {
  boda: {
    bannerClass: 'banner--boda',
    decoration: '✿ ♡ ✿',
    title: 'Estás invitado a\nun momento inolvidable',
    subtitle: 'Nos encantaría que formes parte de este día tan especial.',
    nameStyle: 'inv-event-name inv-event-name--script',
    separator: '✿ ♡ ✿',
    accentColor: '#be8a60',
  },
  'quinceañero': {
    bannerClass: 'banner--quinceañero',
    decoration: '✨ 👑 ✨',
    title: '¡Una celebración\nmuy especial!',
    subtitle: 'Tu presencia hará este día aún más mágico y memorable.',
    nameStyle: 'inv-event-name inv-event-name--script',
    separator: '✨ 💜 ✨',
    accentColor: '#9333ea',
  },
  empresarial: {
    bannerClass: 'banner--empresarial',
    decoration: '◈ ◈ ◈',
    title: 'Está cordialmente\ninvitado a',
    subtitle: 'Su presencia es importante para nosotros en este evento.',
    nameStyle: 'inv-event-name',
    separator: '— · —',
    accentColor: '#0369a1',
  },
  social: {
    bannerClass: 'banner--social',
    decoration: '🎉 ★ 🎉',
    title: '¡Estás invitado a\ncelebrar juntos!',
    subtitle: 'Queremos compartir este momento especial contigo.',
    nameStyle: 'inv-event-name',
    separator: '✦ · ✦',
    accentColor: '#d97706',
  },
  conferencia: {
    bannerClass: 'banner--conferencia',
    decoration: '◇ ◇ ◇',
    title: 'Lo invitamos a\nparticipar en',
    subtitle: 'Su participación enriquecerá esta sesión de conocimiento.',
    nameStyle: 'inv-event-name',
    separator: '— · —',
    accentColor: '#6366F1',
  },
};

// ─── Datos mock del token ────────────────────────────────────
// En producción: GET /api/rsvp/:token → estos datos vienen del backend
function getMockInvitation(token: string) {
  // Simulamos diferentes tipos según el token para demo
  const typeMap: Record<string, EventType> = {
    'boda-demo':        'boda',
    'quince-demo':      'quinceañero',
    'empresa-demo':     'empresarial',
    'social-demo':      'social',
    'conf-demo':        'conferencia',
  };

  const eventType = typeMap[token] ?? 'boda';

  return {
    guestName: 'Ana María Flores',
    eventId: 'evt-1',
    eventType,
    eventName: eventType === 'boda'         ? 'Boda de Juan & Ana'
              : eventType === 'quinceañero'  ? 'Quinceañero de Valentina'
              : eventType === 'empresarial'  ? 'Conferencia Empresarial 2025'
              : eventType === 'social'       ? 'Reunión de Promoción 2015'
              : 'NextEvent Summit 2025',
    date: '20 de Julio, 2025',
    time: '4:00 PM',
    location: eventType === 'boda' ? 'Hacienda Los Olivos' : 'Centro de Eventos Lima',
    locationDetail: 'Pachacamac, Lima',
    guestCount: 200,
    confirmBefore: '18 de Julio, 2025',
    contactEmail: `evento@nextevent.com`,
    // hoursUntilEvent > 48 → válido; < 48 → caducado (US-06)
    hoursUntilEvent: 72,
  };
}

function RSVPConfirmPage() {
  const { token = 'boda-demo' } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const invitation = getMockInvitation(token);
  const tpl = TEMPLATES[invitation.eventType];

  // US-06: regla de las 48 horas — redirige a enlace caducado
  if (invitation.hoursUntilEvent < 48) {
    navigate('/rsvp/expired', { replace: true });
    return null;
  }

  const handleResponse = (accepted: boolean) => {
    // En producción: PATCH /api/rsvp/:token { accepted }
    navigate(`/rsvp/${accepted ? 'success' : 'declined'}`);
  };

  return (
    <div className="rsvp-page">
      {/* Logo */}
      <div className="rsvp-page__logo">
        <div className="rsvp-page__logo-icon">✦</div>
        NexEvent
      </div>

      {/* Tarjeta de invitación */}
      <div className="invitation-card animate-fade-in-up">

        {/* Banner superior por tipo */}
        <div className={`invitation-card__banner ${tpl.bannerClass}`} />

        <div className="invitation-card__body">
          <div className="inv-decoration">{tpl.decoration}</div>

          <h1 className="inv-title">
            {tpl.title.split('\n').map((line, i) => (
              <span key={i}>{line}{i < tpl.title.split('\n').length - 1 && <br />}</span>
            ))}
          </h1>

          <p className="inv-subtitle">{tpl.subtitle}</p>

          <div className={tpl.nameStyle} style={{ color: tpl.accentColor }}>
            {invitation.eventName.split(' ').slice(0, 2).join(' ')}<br />
            {invitation.eventName.split(' ').slice(2).join(' ')}
          </div>

          {/* Datos del evento */}
          <div className="inv-details">
            <div className="inv-detail-item">
              <span className="inv-detail-icon">📅</span>
              <span className="inv-detail-main">{invitation.date}</span>
              <span className="inv-detail-sub">{invitation.time}</span>
            </div>
            <div className="inv-detail-item">
              <span className="inv-detail-icon">📍</span>
              <span className="inv-detail-main">{invitation.location}</span>
              <span className="inv-detail-sub">{invitation.locationDetail}</span>
            </div>
            <div className="inv-detail-item">
              <span className="inv-detail-icon">👥</span>
              <span className="inv-detail-main">{invitation.guestCount}</span>
              <span className="inv-detail-sub">Invitados</span>
            </div>
          </div>

          <div className="inv-separator">{tpl.separator}</div>

          <p className="inv-confirm-title">¿Confirmas tu asistencia?</p>
          <p className="inv-deadline">
            Por favor, confirma tu asistencia antes del {invitation.confirmBefore}.
          </p>

          {/* Botones de respuesta — US-06 */}
          <div className="inv-buttons">
            <button
              className="inv-btn inv-btn--accept"
              onClick={() => handleResponse(true)}
              type="button"
            >
              <div className="inv-btn__icon">✓</div>
              <span className="inv-btn__label">Asistiré</span>
              <span className="inv-btn__sublabel">¡No me lo perderé!</span>
            </button>
            <button
              className="inv-btn inv-btn--decline"
              onClick={() => handleResponse(false)}
              type="button"
            >
              <div className="inv-btn__icon">✕</div>
              <span className="inv-btn__label">No Asistiré</span>
              <span className="inv-btn__sublabel">Lo siento, no podré asistir</span>
            </button>
          </div>

          {/* Contacto */}
          <div className="inv-contact">
            <span className="inv-contact-icon">✉️</span>
            <p className="inv-contact-text">
              Si tienes alguna duda, puedes escribirnos a{' '}
              <span className="inv-contact-email">{invitation.contactEmail}</span>
            </p>
          </div>
        </div>

        <div className="invitation-card__footer">
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
            🔒 Tu respuesta es confidencial y será registrada de forma segura.
          </p>
        </div>
      </div>

      {/* Footer de página */}
      <div className="rsvp-page__footer">
        <div className="rsvp-page__powered">
          <span>Powered by</span>
          <a href="/">NexEvent</a>
        </div>
      </div>
    </div>
  );
}

export default RSVPConfirmPage;
