import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RatingsPage.css';

// ─── Datos de prueba ───────────────────────────────────────────────────────
const MOCK_EVENT = {
  id: 'evt-1',
  name: 'Boda de Juan & Ana',
  date: '20 de Julio, 2025',
  location: 'Hacienda Los Olivos',
  image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80'
};

const SERVICES = [
  { id: 's1', category: 'CATERING', name: 'Sabor Plus Catering', avgRating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80' },
  { id: 's2', category: 'FOTOGRAFÍA', name: 'FotoRecuerdos', avgRating: 4.9, reviews: 86, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80' },
  { id: 's3', category: 'DECORACIÓN', name: 'DecorArte Eventos', avgRating: 4.7, reviews: 63, image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=400&q=80' },
  { id: 's4', category: 'MÚSICA / DJ', name: 'BeatTime DJs', avgRating: 4.6, reviews: 51, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80' },
];

const STAR_LABELS: Record<number, string> = {
  1: 'Malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

function RatingsPage() {
  const [showAlert, setShowAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Estado para guardar las calificaciones del usuario
  const [ratings, setRatings] = useState<Record<string, { stars: number, review: string }>>({});

  const handleStarClick = (serviceId: string, stars: number) => {
    setRatings(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], stars, review: prev[serviceId]?.review || '' }
    }));
  };

  const handleReviewChange = (serviceId: string, text: string) => {
    if (text.length > 300) return;
    setRatings(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], stars: prev[serviceId]?.stars || 0, review: text }
    }));
  };

  const ratedCount = Object.values(ratings).filter(r => r.stars > 0).length;
  const totalServices = SERVICES.length;
  const progressPct = (ratedCount / totalServices) * 100;

  const handleSubmit = () => {
    if (ratedCount === 0) return;
    setIsSubmitting(true);
    
    // Simular llamada a API
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({ msg: '¡Tus calificaciones han sido guardadas con éxito! Gracias por tu aporte.', type: 'success' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  return (
    <div className="ratings animate-fade-in">
      {/* Breadcrumb + botón superior */}
      <div className="ratings__topbar">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Eventos</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/" className="breadcrumb__link">{MOCK_EVENT.name}</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Calificar servicios</span>
        </nav>
        <div className="ratings__topbar-actions">
          <button className="bell-btn" type="button">
            🔔 <span className="bell-badge">3</span>
          </button>
          <button 
            className="btn-submit-ratings" 
            onClick={handleSubmit} 
            type="button"
            disabled={ratedCount === 0 || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : '➤ Enviar calificaciones'}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="ratings__header">
        <div className="ratings__header-icon">⭐</div>
        <div className="ratings__header-text">
          <h1 className="ratings__title">Califica los servicios del evento</h1>
          <p className="ratings__subtitle">Comparte tu experiencia para ayudar a otros invitados.</p>
        </div>
      </div>

      {feedback && (
        <div className={`ratings__alert animate-fade-in-down`} style={{ background: feedback.type === 'error' ? '#FEF2F2' : '#ECFDF5', borderColor: feedback.type === 'error' ? '#FECACA' : '#A7F3D0' }}>
          <div className="ratings__alert-icon" style={{ color: feedback.type === 'error' ? '#DC2626' : '#059669' }}>✓</div>
          <div className="ratings__alert-text">
            <span className="ratings__alert-title" style={{ color: feedback.type === 'error' ? '#991B1B' : '#065F46' }}>{feedback.type === 'success' ? 'Éxito' : 'Error'}</span>
            <span className="ratings__alert-desc" style={{ color: feedback.type === 'error' ? '#B91C1C' : '#047857' }}>{feedback.msg}</span>
          </div>
          <button className="ratings__alert-close" onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Alerta de feedback inicial */}
      {showAlert && !feedback && (
        <div className="ratings__alert animate-fade-in-down">
          <div className="ratings__alert-icon">ⓘ</div>
          <div className="ratings__alert-text">
            <span className="ratings__alert-title">Tu opinión es muy importante</span>
            <span className="ratings__alert-desc">Califica cada servicio según tu experiencia durante el evento. Puedes dejar una reseña breve y honesta.</span>
          </div>
          <button className="ratings__alert-close" onClick={() => setShowAlert(false)}>✕</button>
        </div>
      )}

      {/* Layout de dos columnas */}
      <div className="ratings__content">
        
        {/* Columna Principal: Lista de Servicios */}
        <div className="ratings__main">
          <div className="ratings__list">
            {SERVICES.map((service) => {
              const currentRating = ratings[service.id]?.stars || 0;
              const currentReview = ratings[service.id]?.review || '';

              return (
                <div key={service.id} className="service-card">
                  <img src={service.image} alt={service.name} className="service-card__img" loading="lazy" />
                  
                  <div className="service-card__info">
                    <span className="service-card__category">{service.category}</span>
                    <h3 className="service-card__name">{service.name}</h3>
                    <div className="service-card__rating">
                      <span className="service-card__star-icon">★</span>
                      <span className="service-card__score">{service.avgRating}</span>
                      <span>({service.reviews} reseñas)</span>
                    </div>
                  </div>

                  <div className="service-card__action">
                    <span className="service-card__action-label">¿Cómo calificarías este servicio? *</span>
                    <div className="service-card__stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          className={`star-btn ${star <= currentRating ? 'active' : ''}`}
                          onClick={() => handleStarClick(service.id, star)}
                        >
                          {star <= currentRating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                    <div className="service-card__status">
                      {currentRating > 0 ? STAR_LABELS[currentRating] : ''}
                    </div>
                  </div>

                  <div className="service-card__review">
                    <div className="service-card__review-header">
                      <span className="service-card__review-label">Escribe una reseña <span className="service-card__review-opt">(opcional)</span></span>
                    </div>
                    <textarea 
                      className="service-card__textarea" 
                      placeholder="Ej. La comida estuvo deliciosa y el servicio excelente..."
                      value={currentReview}
                      onChange={(e) => handleReviewChange(service.id, e.target.value)}
                    ></textarea>
                    <div className="service-card__counter">
                      {currentReview.length}/300
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Lateral */}
        <div className="ratings__sidebar">
          
          <div className="sidebar-card">
            <h3 className="sidebar-card__title">Sobre el evento</h3>
            <div className="event-info">
              <img src={MOCK_EVENT.image} alt={MOCK_EVENT.name} className="event-info__img" />
              <div className="event-info__details">
                <span className="event-info__name">{MOCK_EVENT.name}</span>
                <span className="event-info__meta">📅 {MOCK_EVENT.date}</span>
                <span className="event-info__meta">📍 {MOCK_EVENT.location}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="progress-header">
              <span>Servicios por calificar</span>
              <span className="progress-count">{ratedCount} de {totalServices}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="progress-msg">
              {ratedCount === totalServices ? '¡Gracias por tu participación!' : 'Aún faltan servicios por evaluar.'}
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-card__title">Consejos para calificar</h3>
            <div className="tips-list">
              <div className="tip-item">
                <div className="tip-icon">🛡️</div>
                <div className="tip-text">
                  <span className="tip-title">Sé honesto y respetuoso</span>
                  <span className="tip-desc">Tu opinión sincera ayuda a mejorar la calidad de los servicios.</span>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-text">
                  <span className="tip-title">Considera tu experiencia</span>
                  <span className="tip-desc">Evalúa la calidad, puntualidad, atención y profesionalismo.</span>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🤝</div>
                <div className="tip-text">
                  <span className="tip-title">Ayuda a la comunidad</span>
                  <span className="tip-desc">Tus reseñas ayudan a otros invitados a tomar decisiones informadas.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default RatingsPage;
