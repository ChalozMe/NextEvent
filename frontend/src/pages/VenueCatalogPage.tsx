import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { venueService } from '../services/venueService';
import type { Venue } from '../types';
import './VenueCatalogPage.css';

const VenueCatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const data = await venueService.getVenues(activeCategory);
        setVenues(data);
      } catch (error) {
        console.error("Error al cargar locales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [activeCategory]);

  const filteredVenues = venues.filter((v) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(searchLower) ||
      v.district.toLowerCase().includes(searchLower) ||
      v.category.toLowerCase().includes(searchLower) ||
      v.address.toLowerCase().includes(searchLower)
    );
  });

  const getTypeClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('boda')) return 'boda';
    if (cat.includes('empresarial')) return 'empresarial';
    if (cat.includes('quince')) return 'quince';
    return 'boda';
  };

  return (
    <div className="venues-container">
      {/* Header Profile */}
      <div className="venues-header-top">
        <div className="action-icon">
          🔔
          <span className="notification-badge">3</span>
        </div>
        <div className="venues-header-user">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="venues-user-avatar" />
          <div className="venues-user-name">
            {user?.fullName || 'María López'}
            <span>⌄</span>
          </div>
        </div>
      </div>

      <h1 className="venues-title">Explora los mejores locales en Arequipa</h1>
      <p className="venues-subtitle">Encuentra el lugar perfecto para tu evento en Arequipa entre nuestra selección de locales verificados.</p>

      {/* Search Row */}
      <div className="venues-search-row">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre, distrito o tipo de evento (ej. Sabandía, Yanahuara)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-input-group">
          <span className="filter-input-label">Ubicación</span>
          <div className="filter-dropdown">
            <div className="filter-dropdown-content">
              <span>📍</span> Arequipa, Perú
            </div>
          </div>
        </div>

        <div className="filter-input-group">
          <span className="filter-input-label">Capacidad mínima</span>
          <div className="filter-dropdown">
            <div className="filter-dropdown-content">
              <span>👥</span> Cualquier capacidad
            </div>
            <span>⌄</span>
          </div>
        </div>

        <button className="btn-advanced-filters">
          <span style={{transform: 'rotate(90deg)', display: 'inline-block'}}>↹</span> Filtros
        </button>
      </div>

      {/* Categories Row */}
      <div className="venues-categories-row">
        <div className="category-pills">
          <span className="category-label">Filtrar por:</span>
          {['Todos', 'Boda', 'Quinceañero', 'Empresarial', 'Social'].map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="sort-dropdown">
          Ordenar por: <span>Recomendados</span> ⌄
        </div>
      </div>

      <div className="results-count">{filteredVenues.length} locales encontrados en Arequipa</div>

      {/* Grid */}
      {loading ? (
        <p style={{ padding: '2rem 0', textAlign: 'center' }}>Cargando locales de Arequipa...</p>
      ) : (
        <div className="venues-grid">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
              <div className="venue-card-img-wrapper">
                <img src={venue.image} alt={venue.name} className="venue-card-img" />
                <button className="venue-card-like">♡</button>
                <span className={`venue-type-badge ${getTypeClass(venue.category)}`}>{venue.category}</span>
              </div>
              <div className="venue-card-content">
                <div className="venue-card-header">
                  <h3 className="venue-name">{venue.name}</h3>
                  <div className="venue-rating">
                    <div className="venue-stars">
                      <span className="star-icon">★</span> {venue.rating}
                    </div>
                    <span className="venue-reviews">({venue.reviewCount} reseñas)</span>
                  </div>
                </div>
                
                <div className="venue-location">
                  <span>📍</span> {venue.district}, Arequipa
                </div>

                <div className="venue-card-footer">
                  <div className="venue-meta-block">
                    <span className="venue-meta-label"><span>👥</span> Capacidad máxima</span>
                    <span className="venue-meta-value">{venue.capacity} personas</span>
                  </div>
                  <div className="venue-meta-block">
                    <span className="venue-meta-label">Precio referencial</span>
                    <span className="venue-meta-value">S/ {venue.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueCatalogPage;
