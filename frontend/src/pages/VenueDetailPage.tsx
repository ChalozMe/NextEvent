import { Link } from 'react-router-dom';
import './VenueDetailPage.css';

const VenueDetailPage = () => {
  return (
    <div className="venue-detail-container">
      {/* Top Header */}
      <div className="venue-detail-header-top">
        <Link to="/venues" className="back-link">
          ← Volver a locales
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
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80" 
            alt="Hacienda Los Olivos Main" 
            className="gallery-main" 
          />
        </div>
        <div className="gallery-side">
          <div className="gallery-side-img-wrapper">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80" alt="Gallery 1" className="gallery-side-img top-right" />
            <div className="gallery-count-badge">1/24</div>
          </div>
          <div className="gallery-side-img-wrapper">
            <img src="https://images.unsplash.com/photo-1533174000255-16dbcb035ffa?auto=format&fit=crop&w=600&q=80" alt="Gallery 2" className="gallery-side-img" />
          </div>
          <div className="gallery-side-img-wrapper">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80" alt="Gallery 3" className="gallery-side-img" />
          </div>
          <div className="gallery-side-img-wrapper">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" alt="Gallery 4" className="gallery-side-img bottom-right" />
          </div>
        </div>
      </div>

      <div className="venue-detail-content">
        {/* Left Column */}
        <div className="venue-info-section">
          
          <div className="venue-title-row">
            <div className="venue-title-left">
              <h1>
                Hacienda Los Olivos
                <span className="verified-badge">✓</span>
              </h1>
              <p><span>📍</span> Pachacamac, Lima</p>
            </div>
            <div className="venue-rating-big">
              <div className="rating-score">
                <span className="star">★</span> 4.8
              </div>
              <div className="rating-reviews">(124 reseñas)</div>
            </div>
          </div>

          <p className="venue-description">
            Un espacio campestre único rodeado de naturaleza, ideal para bodas, quinceañeros y eventos empresariales. Contamos con amplios jardines, salones elegantes y un servicio de primer nivel para que tu evento sea inolvidable.
          </p>

          <div className="highlights-grid">
            <div className="highlight-box">
              <div className="highlight-icon">👥</div>
              <div className="highlight-text">
                <span className="highlight-label">Capacidad máxima</span>
                <span className="highlight-value">300 personas</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">🏢</div>
              <div className="highlight-text">
                <span className="highlight-label">Espacios disponibles</span>
                <span className="highlight-value">3 salones</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">🚗</div>
              <div className="highlight-text">
                <span className="highlight-label">Estacionamiento</span>
                <span className="highlight-value">100 vehículos</span>
              </div>
            </div>
            <div className="highlight-box">
              <div className="highlight-icon">❄️</div>
              <div className="highlight-text">
                <span className="highlight-label">Aire acondicionado</span>
                <span className="highlight-value">Sí</span>
              </div>
            </div>
          </div>

          <div className="venue-tabs">
            <button className="tab-btn active">Descripción</button>
            <button className="tab-btn">Servicios</button>
            <button className="tab-btn">Instalaciones</button>
            <button className="tab-btn">Políticas</button>
          </div>

          <div className="tab-content">
            <h3>Descripción del lugar</h3>
            <p>
              Hacienda Los Olivos combina elegancia y naturaleza en un solo lugar. Nuestros jardines y salones están diseñados para adaptarse a eventos de cualquier tamaño.
            </p>

            <div className="includes-section">
              <h4>Incluye</h4>
              <div className="includes-grid">
                <div className="include-item">
                  <span className="check-icon">✓</span> Mesas y sillas
                </div>
                <div className="include-item">
                  <span className="check-icon">✓</span> Cocina y catering (opcional)
                </div>
                <div className="include-item">
                  <span className="check-icon">✓</span> Mobiliario básico
                </div>
                <div className="include-item">
                  <span className="check-icon">✓</span> Seguridad
                </div>
                <div className="include-item">
                  <span className="check-icon">✓</span> Personal de apoyo
                </div>
                <div className="include-item">
                  <span className="check-icon">✓</span> Estacionamiento privado
                </div>
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
            <div className="pricing-amount">S/ 18,000</div>
            <p className="pricing-note">
              El precio puede variar según la fecha y el número de invitados.
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

          <div className="sidebar-card calendar-card">
            <h3>Disponibilidad</h3>
            <div className="calendar-month-nav">
              <button className="calendar-nav-btn">‹</button>
              Julio 2025
              <button className="calendar-nav-btn">›</button>
            </div>
            
            <div className="calendar-grid">
              <div className="calendar-day-header">LUN</div>
              <div className="calendar-day-header">MAR</div>
              <div className="calendar-day-header">MIÉ</div>
              <div className="calendar-day-header">JUE</div>
              <div className="calendar-day-header">VIE</div>
              <div className="calendar-day-header">SÁB</div>
              <div className="calendar-day-header">DOM</div>

              {/* Week 1 */}
              <div className="calendar-day other-month">30</div>
              <div className="calendar-day other-month">1</div>
              <div className="calendar-day">2</div>
              <div className="calendar-day">3</div>
              <div className="calendar-day">4</div>
              <div className="calendar-day">5</div>
              <div className="calendar-day">6</div>

              {/* Week 2 */}
              <div className="calendar-day">7</div>
              <div className="calendar-day">8</div>
              <div className="calendar-day">9</div>
              <div className="calendar-day">10</div>
              <div className="calendar-day">11</div>
              <div className="calendar-day">12</div>
              <div className="calendar-day">13</div>

              {/* Week 3 */}
              <div className="calendar-day">14</div>
              <div className="calendar-day">15</div>
              <div className="calendar-day">16</div>
              <div className="calendar-day">17</div>
              <div className="calendar-day">18</div>
              <div className="calendar-day">19</div>
              <div className="calendar-day selected">20</div>

              {/* Week 4 */}
              <div className="calendar-day">21</div>
              <div className="calendar-day">22</div>
              <div className="calendar-day">23</div>
              <div className="calendar-day">24</div>
              <div className="calendar-day">25</div>
              <div className="calendar-day">26</div>
              <div className="calendar-day">27</div>

              {/* Week 5 */}
              <div className="calendar-day">28</div>
              <div className="calendar-day">29</div>
              <div className="calendar-day">30</div>
              <div className="calendar-day">31</div>
              <div className="calendar-day other-month">1</div>
              <div className="calendar-day other-month">2</div>
              <div className="calendar-day other-month">3</div>
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-dot disponible"></span> Disponible
              </div>
              <div className="legend-item">
                <span className="legend-dot reservado"></span> Reservado
              </div>
              <div className="legend-item">
                <span className="legend-dot consulta"></span> Consulta
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="reviews-header">
              <h3>Reseñas destacadas</h3>
              <a href="#" className="reviews-link">Ver todas</a>
            </div>

            <div className="review-item">
              <div className="review-user">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="review-avatar" />
                <div className="review-user-info">
                  <span className="review-name">Ana María F.</span>
                  <div className="review-stars">
                    <span>5.0</span> ★★★★★
                  </div>
                </div>
              </div>
              <div className="review-text">
                El lugar es hermoso y el servicio excelente. Hicieron de nuestra boda un día inolvidable.
              </div>
              <div className="review-date">Mayo 2025</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
