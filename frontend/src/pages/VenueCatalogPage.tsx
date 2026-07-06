import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VenueCatalogPage.css';

const VenueCatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const venues = [
    {
      id: 1,
      name: 'Hacienda Los Olivos',
      type: 'Boda',
      typeClass: 'boda',
      rating: 4.8,
      reviews: 124,
      location: 'Pachacamac, Lima',
      capacity: 300,
      price: '18,000',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Centro de Convenciones Lima',
      type: 'Empresarial',
      typeClass: 'empresarial',
      rating: 4.6,
      reviews: 98,
      location: 'San Borja, Lima',
      capacity: 500,
      price: '25,000',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'Salón Cristal',
      type: 'Quinceañero',
      typeClass: 'quince',
      rating: 4.5,
      reviews: 76,
      location: 'Los Olivos, Lima',
      capacity: 250,
      price: '12,500',
      image: 'https://images.unsplash.com/photo-1533174000255-16dbcb035ffa?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      name: 'Villa del Sol',
      type: 'Boda',
      typeClass: 'boda',
      rating: 4.7,
      reviews: 63,
      location: 'Cieneguilla, Lima',
      capacity: 200,
      price: '15,000',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      name: 'Terraza del Mar',
      type: 'Empresarial',
      typeClass: 'empresarial',
      rating: 4.4,
      reviews: 52,
      location: 'Barranco, Lima',
      capacity: 150,
      price: '9,500',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      name: 'Jardines de la Pradera',
      type: 'Quinceañero',
      typeClass: 'quince',
      rating: 4.6,
      reviews: 88,
      location: 'La Molina, Lima',
      capacity: 180,
      price: '11,800',
      image: 'https://images.unsplash.com/photo-1530103862676-de8892ebe6c4?auto=format&fit=crop&w=600&q=80',
    },
  ];

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

      <h1 className="venues-title">Explora los mejores locales para tu evento</h1>
      <p className="venues-subtitle">Encuentra el lugar perfecto entre nuestra selección de locales verificados.</p>

      {/* Search Row */}
      <div className="venues-search-row">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre, ubicación o tipo de lugar..."
          />
        </div>
        
        <div className="filter-input-group">
          <span className="filter-input-label">Fecha del evento</span>
          <div className="filter-dropdown">
            <div className="filter-dropdown-content">
              <span>📅</span> 20 de Julio, 2025
            </div>
            <span>⌄</span>
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
          <button className="category-pill active">Todo</button>
          <button className="category-pill">Boda</button>
          <button className="category-pill">Quinceañero</button>
          <button className="category-pill">Empresarial</button>
        </div>
        <div className="sort-dropdown">
          Ordenar por: <span>Recomendados</span> ⌄
        </div>
      </div>

      <div className="results-count">24 locales encontrados</div>

      {/* Grid */}
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
            <div className="venue-card-img-wrapper">
              <img src={venue.image} alt={venue.name} className="venue-card-img" />
              <button className="venue-card-like">♡</button>
              <span className={`venue-type-badge ${venue.typeClass}`}>{venue.type}</span>
            </div>
            <div className="venue-card-content">
              <div className="venue-card-header">
                <h3 className="venue-name">{venue.name}</h3>
                <div className="venue-rating">
                  <div className="venue-stars">
                    <span className="star-icon">★</span> {venue.rating}
                  </div>
                  <span className="venue-reviews">({venue.reviews} reseñas)</span>
                </div>
              </div>
              
              <div className="venue-location">
                <span>📍</span> {venue.location}
              </div>

              <div className="venue-card-footer">
                <div className="venue-meta-block">
                  <span className="venue-meta-label"><span>👥</span> Capacidad máxima</span>
                  <span className="venue-meta-value">{venue.capacity} personas</span>
                </div>
                <div className="venue-meta-block">
                  <span className="venue-meta-label">Precio referencial</span>
                  <span className="venue-meta-value">S/ {venue.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCatalogPage;
