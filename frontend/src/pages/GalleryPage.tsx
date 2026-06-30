import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GalleryPage.css';

// ─── Datos de prueba ───────────────────────────────────────────────────────
const MOCK_EVENT = {
  id: 'evt-1',
  name: 'Boda de Juan & Ana',
};

// URL de fotos placeholder (simulando una boda vinculada a 'evt-1')
const INITIAL_PHOTOS = [
  { id: 'p1', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80', uploader: 'Maria' },
  { id: 'p2', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80', uploader: 'Juan' },
  { id: 'p3', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80', uploader: 'Ana' },
  { id: 'p4', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&q=80', uploader: 'Carlos' },
  { id: 'p5', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80', uploader: 'Maria' },
  { id: 'p6', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1505932794465-147d1f1bce20?auto=format&fit=crop&w=400&q=80', uploader: 'Luis' },
  { id: 'p7', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=400&q=80', uploader: 'Elena' },
  { id: 'p8', eventId: 'evt-1', url: 'https://images.unsplash.com/photo-1522413452208-9969062f7f15?auto=format&fit=crop&w=800&q=80', uploader: 'Juan' },
];

// Límite de subida (RF12)
const MAX_PHOTOS_PER_GUEST = 5;

function GalleryPage() {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [filter, setFilter] = useState<'todas' | 'mis_fotos'>('todas');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Simulación: usuario actual
  const currentUser = 'Maria'; // En una app real vendría del AuthContext

  const displayPhotos = filter === 'todas' ? photos : photos.filter(p => p.uploader === currentUser);

  // RF12: Subir fotos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validación de límite
    if (uploadedCount + files.length > MAX_PHOTOS_PER_GUEST) {
      setAlert({ msg: `Solo puedes subir un máximo de ${MAX_PHOTOS_PER_GUEST} fotos por evento.`, type: 'error' });
      setTimeout(() => setAlert(null), 4000);
      return;
    }

    // Simulamos la carga agregando fotos de prueba locales o placeholders
    const newPhotos = Array.from(files).map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      eventId: MOCK_EVENT.id, // Vinculación explícita al evento actual
      // Usamos object URL para mostrar inmediatamente la imagen local subida
      url: URL.createObjectURL(f),
      uploader: currentUser
    }));

    setPhotos(prev => [...newPhotos, ...prev]); // Agregar al principio
    setUploadedCount(prev => prev + files.length);
    setAlert({ msg: `${files.length} foto(s) subida(s) correctamente a la galería compartida.`, type: 'success' });
    setTimeout(() => setAlert(null), 4000);
    
    // Resetear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Simular el evento change del input file para reciclar lógica
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Mock de subida
      const pseudoEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(pseudoEvent);
    }
  };

  return (
    <div className="gallery animate-fade-in">
      {/* Breadcrumb + botón superior */}
      <div className="gallery__topbar">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Eventos</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/" className="breadcrumb__link">{MOCK_EVENT.name}</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Galería de fotos</span>
        </nav>
        <div className="gallery__topbar-actions">
          <button className="bell-btn" type="button">
            🔔 <span className="bell-badge">3</span>
          </button>
          <button className="btn-add-photos" onClick={() => fileInputRef.current?.click()} type="button">
            + Subir fotos
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="gallery__header">
        <div className="gallery__header-icon">🖼️</div>
        <div className="gallery__header-text">
          <h1 className="gallery__title">Galería: {MOCK_EVENT.name}</h1>
          <p className="gallery__subtitle">Todas las fotos aquí pertenecen a este evento. Compartidas por los invitados.</p>
        </div>
      </div>

      {/* Alerta de feedback */}
      {alert && (
        <div className={`alert ${alert.type === 'error' ? 'alert--error' : 'alert--success'} animate-fade-in-down`} style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '0.5rem', background: alert.type === 'error' ? '#FEF2F2' : '#ECFDF5', color: alert.type === 'error' ? '#DC2626' : '#059669', border: `1px solid ${alert.type === 'error' ? '#FECACA' : '#A7F3D0'}` }}>
          {alert.msg}
        </div>
      )}

      {/* Toolbar: Filtros y Vistas */}
      <div className="gallery__toolbar">
        <div className="gallery__filters">
          <button 
            className={`gallery__filter-btn ${filter === 'todas' ? 'gallery__filter-btn--active' : ''}`}
            onClick={() => setFilter('todas')}
          >
            <span>▦</span> Todas las fotos
          </button>
          <button 
            className={`gallery__filter-btn ${filter === 'mis_fotos' ? 'gallery__filter-btn--active' : ''}`}
            onClick={() => setFilter('mis_fotos')}
          >
            <span>👤</span> Mis fotos
          </button>
          <select className="gallery__filter-select">
            <option>Todas las fechas</option>
            <option>Hoy</option>
            <option>Ayer</option>
          </select>
        </div>

        <div className="gallery__views">
          <div className="gallery__view-icons">
            <button className="gallery__view-btn gallery__view-btn--active">▦</button>
            <button className="gallery__view-btn">≡</button>
          </div>
          <select className="gallery__filter-select" style={{ paddingLeft: '1rem' }}>
            <option>Más recientes</option>
            <option>Más antiguas</option>
          </select>
        </div>
      </div>

      {/* Tarjeta de Estadísticas de la Galería */}
      <div className="gallery__stats-card">
        <div className="gallery__stats-left">
          <div className="gallery__stats-icon">🖼️</div>
          <div className="gallery__stats-text">
            <span className="gallery__stats-count">{photos.length} fotos compartidas</span>
            <span className="gallery__stats-sub">Por {new Set(photos.map(p => p.uploader)).size} invitados</span>
          </div>
        </div>
        
        <div className="gallery__stats-avatars">
          <img src="https://i.pravatar.cc/100?img=1" className="gallery__stats-avatar" alt="Avatar" />
          <img src="https://i.pravatar.cc/100?img=2" className="gallery__stats-avatar" alt="Avatar" />
          <img src="https://i.pravatar.cc/100?img=3" className="gallery__stats-avatar" alt="Avatar" />
          <img src="https://i.pravatar.cc/100?img=4" className="gallery__stats-avatar" alt="Avatar" />
          <div className="gallery__stats-avatar gallery__stats-more">+18</div>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="gallery__grid">
        {displayPhotos.map(photo => (
          <div key={photo.id} className="gallery__img-box">
            <img src={photo.url} alt={`Foto subida por ${photo.uploader}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Área de Subida Drag & Drop (RF12) */}
      <div 
        className="gallery__upload-zone" 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
        <div className="gallery__upload-left">
          <div className="gallery__upload-icon">☁️</div>
          <div className="gallery__upload-text">
            <span className="gallery__upload-title">
              Arrastra tus fotos aquí o <span onClick={() => fileInputRef.current?.click()}>haz clic para seleccionar</span>
            </span>
            <span className="gallery__upload-sub">Formatos permitidos: JPG, PNG, HEIC • Máx. 20MB por foto • Límite {MAX_PHOTOS_PER_GUEST} fotos</span>
          </div>
        </div>
        
        <button className="btn-upload-select" onClick={() => fileInputRef.current?.click()}>
          ↑ Seleccionar fotos
        </button>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="gallery__hidden-input" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

    </div>
  );
}

export default GalleryPage;
