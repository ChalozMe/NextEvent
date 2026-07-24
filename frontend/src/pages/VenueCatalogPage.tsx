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

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexevent_favorite_venues');
    return saved ? JSON.parse(saved) : [];
  });

  // Filters state
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Todos');
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

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

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((favId) => favId !== id) : [...prev, id];
      localStorage.setItem('nexevent_favorite_venues', JSON.stringify(updated));
      return updated;
    });
  };

  // Distritos únicos disponibles
  const districts = ['Todos', 'Yanahuara', 'Sabandía', 'Cayma', 'Sachaca', 'Cercado', 'José Luis Bustamante', 'Selva Alegre', 'Socabaya', 'Characato', 'Tiabaya', 'Cerro Colorado'];

  // Filtering logic
  const filteredVenues = venues
    .filter((v) => {
      // 1. Text Search Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        v.name.toLowerCase().includes(searchLower) ||
        v.district.toLowerCase().includes(searchLower) ||
        v.category.toLowerCase().includes(searchLower) ||
        v.address.toLowerCase().includes(searchLower) ||
        v.description.toLowerCase().includes(searchLower);

      // 2. District Filter
      const matchesDistrict = selectedDistrict === 'Todos' || v.district.toLowerCase() === selectedDistrict.toLowerCase();

      // 3. Minimum Capacity Filter
      const matchesCapacity = v.capacity >= minCapacity;

      return matchesSearch && matchesDistrict && matchesCapacity;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'capacity_desc') return b.capacity - a.capacity;
      return 0; // recommended / default
    });

  const resetFilters = () => {
    setActiveCategory('Todos');
    setSearchTerm('');
    setSelectedDistrict('Todos');
    setMinCapacity(0);
    setSortBy('recommended');
  };

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

      {/* Search & Filter Controls Row */}
      <div className="venues-search-row">
        {/* Text Search Input */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre, distrito o tipo (ej. Sabandía, Yanahuara)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* District Filter Dropdown */}
        <div className="filter-input-group">
          <label className="filter-input-label">Ubicación / Distrito</label>
          <div className="filter-select-wrapper">
            <span className="filter-icon">📍</span>
            <select
              className="filter-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist === 'Todos' ? 'Todos los distritos' : `${dist}, Arequipa`}
                </option>
              ))}
            </select>
            <span className="select-arrow">⌄</span>
          </div>
        </div>

        {/* Minimum Capacity Filter Dropdown */}
        <div className="filter-input-group">
          <label className="filter-input-label">Capacidad mínima</label>
          <div className="filter-select-wrapper">
            <span className="filter-icon">👥</span>
            <select
              className="filter-select"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
            >
              <option value={0}>Cualquier capacidad</option>
              <option value={150}>150+ personas</option>
              <option value={250}>250+ personas</option>
              <option value={400}>400+ personas</option>
              <option value={600}>600+ personas</option>
            </select>
            <span className="select-arrow">⌄</span>
          </div>
        </div>

        {/* Reset / Advanced Filters Button */}
        <button className="btn-advanced-filters" onClick={resetFilters} title="Limpiar todos los filtros">
          <span>↹</span> Limpiar Filtros
        </button>
      </div>

      {/* Categories & Sorting Row */}
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

        {/* Sort Select */}
        <div className="sort-dropdown-container">
          <label className="sort-label">Ordenar por:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Recomendados</option>
            <option value="rating">Mejor calificados (★)</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="capacity_desc">Capacidad: Mayor a Menor</option>
          </select>
        </div>
      </div>

      <div className="results-count">
        {filteredVenues.length} locales encontrados en Arequipa
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ padding: '2rem 0', textAlign: 'center' }}>Cargando locales de Arequipa...</p>
      ) : filteredVenues.length === 0 ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <h3>No se encontraron locales</h3>
          <p style={{ color: '#64748B' }}>Prueba cambiando el filtro de búsqueda o haciendo clic en "Limpiar Filtros".</p>
          <button className="btn-advanced-filters" style={{ margin: '1rem auto 0 auto' }} onClick={resetFilters}>
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="venues-grid">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
              <div className="venue-card-img-wrapper">
                <img src={venue.image} alt={venue.name} className="venue-card-img" />
                <button 
                  className={`venue-card-like ${favorites.includes(venue.id) ? 'active' : ''}`} 
                  onClick={(e) => toggleFavorite(e, venue.id)}
                  title={favorites.includes(venue.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  {favorites.includes(venue.id) ? '♥' : '♡'}
                </button>
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
