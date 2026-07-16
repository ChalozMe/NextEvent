import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { venueService, type VenueReservationData } from '../services/venueService';
import type { Venue } from '../types';
import './VenueDetailPage.css';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reservations, setReservations] = useState<VenueReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calendar State (Default: July 2025)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [resSuccessMsg, setResSuccessMsg] = useState<string | null>(null);
  const [resErrorMsg, setResErrorMsg] = useState<string | null>(null);

  const fetchReservations = async (venueId: string) => {
    try {
      const data = await venueService.getVenueReservations(venueId);
      setReservations(data);
    } catch (err) {
      console.error("Error al obtener reservas del local:", err);
    }
  };

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await venueService.getVenueById(id);
        setVenue(data);
        await fetchReservations(id);
      } catch (err) {
        console.error("Error al obtener detalle del local:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();

    if (id) {
      const saved = localStorage.getItem('nexevent_favorite_venues');
      if (saved) {
        const favList: string[] = JSON.parse(saved);
        setIsFavorite(favList.includes(id));
      }
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    const saved = localStorage.getItem('nexevent_favorite_venues');
    const favList: string[] = saved ? JSON.parse(saved) : [];
    const updated = isFavorite ? favList.filter((favId) => favId !== id) : [...favList, id];
    localStorage.setItem('nexevent_favorite_venues', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper to format date YYYY-MM-DD
  const formatDateString = (year: number, monthZeroBased: number, day: number) => {
    const m = String(monthZeroBased + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Check status of date: 'RESERVADO' | 'MANTENIMIENTO' | 'DISPONIBLE'
  const getDateStatus = (dateStr: string) => {
    for (const res of reservations) {
      if (res.reservedDate === dateStr) {
        return 'RESERVADO';
      }
      if (res.bufferBeforeDates.includes(dateStr) || res.bufferAfterDates.includes(dateStr)) {
        return 'MANTENIMIENTO';
      }
    }
    return 'DISPONIBLE';
  };

  // Build calendar days array for current month view
  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthDays - i,
        isOtherMonth: true,
        dateStr: '',
        status: 'OTHER'
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = formatDateString(year, month, d);
      const status = getDateStatus(dateStr);
      days.push({
        dayNumber: d,
        isOtherMonth: false,
        dateStr,
        status
      });
    }

    return days;
  };

  const handleDayClick = (dayObj: { isOtherMonth: boolean; dateStr: string; status: string }) => {
    if (dayObj.isOtherMonth) return;
    if (dayObj.status === 'RESERVADO') {
      alert("Esta fecha ya se encuentra RESERVADA por otro evento.");
      return;
    }
    if (dayObj.status === 'MANTENIMIENTO') {
      alert("Esta fecha está BLOQUEADA por mantenimiento, limpieza y acondicionamiento del local (4 días antes/después de un evento).");
      return;
    }
    setSelectedDateStr(dayObj.dateStr);
    setResErrorMsg(null);
    setResSuccessMsg(null);
  };

  const handleMakeReservation = async () => {
    if (!selectedDateStr) {
      alert("Por favor, selecciona primero un día disponible (en verde) en el calendario.");
      return;
    }

    if (!id) return;

    setReserving(true);
    setResErrorMsg(null);
    setResSuccessMsg(null);

    try {
      await venueService.createVenueReservation(id, selectedDateStr);
      setResSuccessMsg(`¡Reserva confirmada para el ${selectedDateStr}! Se han bloqueado 4 días antes y 4 días después por mantenimiento y limpieza.`);
      setSelectedDateStr(null);
      await fetchReservations(id);
    } catch (err: any) {
      setResErrorMsg(err.message || "No se pudo completar la reserva");
    } finally {
      setReserving(false);
    }
  };

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

  const calendarDays = buildCalendarDays();

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
          <button 
            className={`btn-icon-circular ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <button className="btn-reserve-header" onClick={handleMakeReservation} disabled={reserving}>
            {reserving ? "Procesando..." : "📅 Reservar este lugar"}
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
              {selectedDateStr 
                ? `Fecha seleccionada: ${selectedDateStr}` 
                : 'Selecciona una fecha disponible (en verde) en el calendario.'}
            </p>

            {resSuccessMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {resSuccessMsg}
              </div>
            )}

            {resErrorMsg && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {resErrorMsg}
              </div>
            )}

            <button className="btn-primary-full" onClick={handleMakeReservation} disabled={reserving}>
              {reserving ? "Reservando..." : selectedDateStr ? `📅 Confirmar Reserva (${selectedDateStr})` : "📅 Reservar este lugar"}
            </button>
            <div className="secondary-actions" style={{ marginTop: '0.5rem' }}>
              <button className="btn-secondary-full">
                💬 Consultar disponibilidad
              </button>
              <button 
                className={`btn-icon-square ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            </div>
          </div>

          {/* Interactive Calendar Card */}
          <div className="sidebar-card calendar-card">
            <h3>Calendario de Disponibilidad</h3>
            <div className="calendar-month-nav">
              <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
              <span>{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
            </div>
            
            <div className="calendar-grid">
              <div className="calendar-day-header">LUN</div>
              <div className="calendar-day-header">MAR</div>
              <div className="calendar-day-header">MIÉ</div>
              <div className="calendar-day-header">JUE</div>
              <div className="calendar-day-header">VIE</div>
              <div className="calendar-day-header">SÁB</div>
              <div className="calendar-day-header">DOM</div>

              {calendarDays.map((dayObj, index) => {
                if (dayObj.isOtherMonth) {
                  return (
                    <div key={index} className="calendar-day other-month">
                      {dayObj.dayNumber}
                    </div>
                  );
                }

                const isSelected = selectedDateStr === dayObj.dateStr;
                let statusClass = 'disponible';
                let dayTitle = 'Disponible para reservar';

                if (dayObj.status === 'RESERVADO') {
                  statusClass = 'reservado';
                  dayTitle = 'Reservado por evento';
                } else if (dayObj.status === 'MANTENIMIENTO') {
                  statusClass = 'mantenimiento';
                  dayTitle = 'Bloqueado por mantenimiento/limpieza (4 días antes/después)';
                }

                return (
                  <div
                    key={index}
                    className={`calendar-day ${statusClass} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(dayObj)}
                    title={dayTitle}
                  >
                    {dayObj.dayNumber}
                  </div>
                );
              })}
            </div>

            <div className="calendar-legend">
              <div className="legend-item" title="Día libre para reservar">
                <span className="legend-dot disponible"></span> Disponible
              </div>
              <div className="legend-item" title="Día reservado por evento">
                <span className="legend-dot reservado"></span> Reservado
              </div>
              <div className="legend-item" title="4 días antes y después por mantenimiento/limpieza">
                <span className="legend-dot mantenimiento"></span> Mantenimiento (±4d)
              </div>
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
