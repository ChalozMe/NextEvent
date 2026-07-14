import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { venueService } from '../services/venueService';
import type { Venue } from '../types';
import './VenueDetailPage.css';

const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await venueService.getVenueById(id);
        setVenue(data);
      } catch (err) {
        console.error("Error al obtener detalle del local:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="venue-detail-container">
        <p style={{ padding: '3rem', textAlign: 'center' }}>Cargando información del local...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-detail-container">
        <p style={{ padding: '3rem', textAlign: 'center' }}>No se encontró el local solicitado.</p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/venues" className="back-link">← Volver al catálogo de locales</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-detail-container">
      {/* Top Header */}
      <div className="venue-detail-header-top">
        <Link to="/venues" className="back-link">
          ← Volver a locales de Arequipa
        </Link>
        <div className="venue-detail-actions">
          <div className="action-icon" style={{position: 'relative', cursor: 'pointer', marginRight: '0.5rem'}}>
            🔔
            <span className="notification-badge" style={{position: 'absolute', top: '-5px', right: '-5px', background: '#6366F1', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem'}}>3</span>
          </div>
          <button className="btn-icon-circular">♡</button>
          <button className="btn-reserve-header">
            📅 Reservar este lugar
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="gallery-grid">
        <div className="gallery-main-wrapper">
          <img 
            src={venue.image} 
            alt={venue.name} 
            className="gallery-main" 
          />
        </div>
        <div className="gallery-side">
          {venue.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="gallery-side-img-wrapper">
              <img src={img} alt={`Galería ${idx + 1}`} className="gallery-side-img" />
              {idx === 0 && <div className="gallery-count-badge">1/4</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="venue-detail-content">
        {/* Left Column */}
        <div className="venue-info-section">
          
          <div className="venue-title-row">
            <div className="venue-title-left">
              <h1>
                {venue.name}
                <span className="verified-badge">✓</span>
              </h1>
              <p><span>📍</span> {venue.address}, {venue.district} - Arequipa</p>
            </div>
            <div className="venue-rating-big">
              <div className="rating-score">
                <span className="star">★</span> {venue.rating}
              </div>
              <div className="rating-reviews">({venue.reviewCount} reseñas)</div>
            </div>
          </div>

          <p className="venue-description">
            {venue.description || 'Un espacio único rodeado de excelente ambiente en Arequipa, ideal para bodas, quinceañeros, eventos sociales y corporativos.'}
          </p>

          <div className="highlights-grid">
            <div className="highlight-box">
              <div className="highlight-icon">👥</div>
              <div className="highlight-text">
                <span className="highlight-label">Capacidad máxima</span>
                <span className="highlight-value">{venue.capacity} personas</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">🏷️</div>
              <div className="highlight-text">
                <span className="highlight-label">Tipo de local</span>
                <span className="highlight-value">{venue.category}</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">📍</div>
              <div className="highlight-text">
                <span className="highlight-label">Distrito</span>
                <span className="highlight-value">{venue.district}</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">⭐</div>
              <div className="highlight-text">
                <span className="highlight-label">Calificación</span>
                <span className="highlight-value">{venue.rating} / 5.0</span>
              </div>
            </div>
          </div>

          <div className="venue-tabs">
            <button className="tab-btn active">Descripción</button>
            <button className="tab-btn">Servicios y Amenidades</button>
            <button className="tab-btn">Políticas</button>
          </div>

          <div className="tab-content">
            <h3>Servicios e Instalaciones Incluidas</h3>

            <div className="includes-section">
              <div className="includes-grid">
                {venue.amenities.length > 0 ? (
                  venue.amenities.map((item, idx) => (
                    <div key={idx} className="include-item">
                      <span className="check-icon">✓</span> {item.trim()}
                    </div>
                  ))
                ) : (
                  <div className="include-item">
                    <span className="check-icon">✓</span> Instalaciones completas y seguridad
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="venue-sidebar">
          
          <div className="sidebar-card">
            <div className="pricing-header">
              <span className="pricing-label">Precio referencial</span>
              <span className="pricing-suffix">desde</span>
            </div>
            <div className="pricing-amount">S/ {venue.price.toLocaleString()}</div>
            <p className="pricing-note">
              El precio puede variar según la fecha seleccionada y el paquete contratado.
            </p>

            <button className="btn-primary-full">
              📅 Reservar este lugar
            </button>
            <div className="secondary-actions">
              <button className="btn-secondary-full">
                💬 Consultar disponibilidad
              </button>
              <button className="btn-icon-square">♡</button>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="reviews-header">
              <h3>Reseñas destacadas</h3>
              <a href="#" className="reviews-link">Ver todas ({venue.reviewCount})</a>
            </div>

            <div className="review-item">
              <div className="review-user">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="review-avatar" />
                <div className="review-user-info">
                  <span className="review-name">María G. (Arequipa)</span>
                  <div className="review-stars">
                    <span>5.0</span> ★★★★★
                  </div>
                </div>
              </div>
              <div className="review-text">
                El lugar en {venue.district} es precioso, la iluminación y atención hicieron de nuestro evento algo inolvidable.
              </div>
              <div className="review-date">Reciente</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
