import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from "../services/eventService";
import type { CreateEventRequest } from "../types";
import './CreateEventPage.css';

type EventType = 'Boda' | 'Quinceañero' | 'Empresarial' | 'Social';

const AREQUIPA_DISTRICTS = [
  'Yanahuara, Arequipa',
  'Sabandía, Arequipa',
  'Cayma, Arequipa',
  'Sachaca, Arequipa',
  'Cercado, Arequipa',
  'José Luis Bustamante, Arequipa',
  'Selva Alegre, Arequipa',
  'Socabaya, Arequipa',
  'Characato, Arequipa',
  'Tiabaya, Arequipa',
  'Cerro Colorado, Arequipa'
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<EventType>('Boda');
  const [startDate, setStartDate] = useState('2025-07-20');
  const [endDate, setEndDate] = useState('2025-07-20');
  const [capacity, setCapacity] = useState('200');
  const [budget, setBudget] = useState('7000.00');
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState(AREQUIPA_DISTRICTS[0]);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (endDate < startDate) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    const event: CreateEventRequest = {
      name,
      type: eventType,
      eventDate: `${startDate}T18:00:00`,
      startDate,
      endDate,
      capacity: Number(capacity),
      location,
      description,
      status: "activo",
      budget: Number(budget),
      coverImage
    };

    try {
      await eventService.createEvent(event);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el evento");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No seleccionada';
    try {
      const parts = dateStr.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return d.toLocaleDateString('es-ES', options);
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$ 0.00';
    return `S/ ${num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="create-event-container">
      {/* Header */}
      <div className="create-header">
        <div className="breadcrumbs">
          <span>Eventos</span>
          <span>&gt;</span>
          <span>Nuevo evento</span>
        </div>
        <div className="create-header-actions">
          <div className="action-icon">
            🔔
            <span className="notification-badge">3</span>
          </div>
          <button className="btn-new-event">
            <span>+</span> Nuevo evento
          </button>
        </div>
      </div>

      <div className="page-title-section">
        <div className="page-title-icon">📅</div>
        <div className="page-title-content">
          <h1>Crear un nuevo evento</h1>
          <p>Completa la información básica de tu evento para iniciar la planificación.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-grid">
        {/* Left Column (Form) */}
        <div className="form-card">
          <h2 className="form-section-title">Información del evento</h2>
          
          <div className="form-group-custom">
            <label className="form-label-custom">Nombre del evento *</label>
            <span className="form-hint">
              Nombre descriptivo que aparecerá en el sistema.
            </span>

            <div className="input-with-icon">
              <span className="input-icon-left">📝</span>

              <input
                type="text"
                className="input-custom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Mi Boda de Ensueño en Arequipa"
                required
              />
            </div>
            
            <label className="form-label-custom" style={{ marginTop: '1.25rem' }}>Tipo de evento *</label>
            <div className="type-cards">
              <label className={`type-card ${eventType === 'Boda' ? 'selected' : ''}`}>
                <div className="type-icon boda">♥</div>
                <div className="type-radio">
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="Boda" 
                    checked={eventType === 'Boda'} 
                    onChange={(e) => setEventType(e.target.value as EventType)}
                  />
                  Boda
                </div>
              </label>

              <label className={`type-card ${eventType === 'Quinceañero' ? 'selected' : ''}`}>
                <div className="type-icon quince">👑</div>
                <div className="type-radio">
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="Quinceañero" 
                    checked={eventType === 'Quinceañero'} 
                    onChange={(e) => setEventType(e.target.value as EventType)}
                  />
                  Quinceañero
                </div>
              </label>

              <label className={`type-card ${eventType === 'Empresarial' ? 'selected' : ''}`}>
                <div className="type-icon empresa">💼</div>
                <div className="type-radio">
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="Empresarial" 
                    checked={eventType === 'Empresarial'} 
                    onChange={(e) => setEventType(e.target.value as EventType)}
                  />
                  Empresarial
                </div>
              </label>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de Inicio *</label>
              <span className="form-hint">Día inicial del evento.</span>
              <div className="input-with-icon">
                <span className="input-icon-left">📅</span>
                <input 
                  type="date" 
                  className="input-custom" 
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de Fin *</label>
              <span className="form-hint">Día final del evento.</span>
              <div className="input-with-icon">
                <span className="input-icon-left">📅</span>
                <input 
                  type="date" 
                  className="input-custom" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-custom">
              <label className="form-label-custom">Aforo estimado *</label>
              <span className="form-hint">Número aproximado de asistentes.</span>
              <div className="input-with-icon">
                <span className="input-icon-left">👥</span>
                <input 
                  type="number" 
                  className="input-custom" 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Presupuesto estimado *</label>
              <span className="form-hint">Ingresa el presupuesto total del evento.</span>
              <div className="input-with-icon">
                <span className="input-icon-left">S/</span>
                <input 
                  type="number" 
                  className="input-custom" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>

            {/* Arequipa District Dropdown Selector */}
            <div className="form-group-custom">
              <label className="form-label-custom">
                Ubicación / Distrito (Arequipa) *
              </label>

              <span className="form-hint">
                Distrito de Arequipa donde se realizará el evento.
              </span>

              <div className="input-with-icon">
                <span className="input-icon-left">📍</span>
                <select
                  className="input-custom"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ cursor: 'pointer', appearance: 'auto' }}
                  required
                >
                  {AREQUIPA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">
                Descripción
              </label>

              <textarea
                className="input-custom"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el evento..."
              />
            </div>
          </div>

          <div className="form-group-custom">
            <label className="form-label-custom">
              Imagen de portada
            </label>

            <div className="input-with-icon">
              <span className="input-icon-left">🖼️</span>

              <input
                type="url"
                className="input-custom"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="info-box">
            <span>ℹ️</span> Al guardar, este evento quedará asociado a tu cuenta como organizador.
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit-event">
              Generar Planificación →
            </button>
          </div>
        </div>

        {/* Right Column (Preview) */}
        <div className="preview-card">
          <h2 className="preview-title">Resumen del evento</h2>
          
          <div className="preview-illustration">
            <div className="preview-illustration-box">
              📅
              <div className="preview-illustration-check">✓</div>
            </div>
          </div>

          <div className="preview-details">

            <div className="preview-item">
              <span className="preview-item-label">
                📝 Nombre
              </span>

              <span className="preview-item-value">
                {name || "Sin nombre"}
              </span>
            </div>

            <div className="preview-item">
              <span className="preview-item-label"><span>♥</span> Tipo de evento</span>
              <span className="preview-item-value">{eventType}</span>
            </div>
            <div className="preview-item">
              <span className="preview-item-label"><span>📅</span> Fechas del evento</span>
              <span className="preview-item-value">
                {startDate === endDate 
                  ? formatDate(startDate) 
                  : `${formatDate(startDate)} al ${formatDate(endDate)}`}
              </span>
            </div>
            <div className="preview-item">
              <span className="preview-item-label"><span>👥</span> Aforo estimado</span>
              <span className="preview-item-value">{capacity || '0'} personas</span>
            </div>
            <div className="preview-item">
              <span className="preview-item-label"><span>💰</span> Presupuesto estimado</span>
              <span className="preview-item-value">{formatCurrency(budget)}</span>
            </div>

            <div className="preview-item">
              <span className="preview-item-label">
                📍 Ubicación / Distrito
              </span>

              <span className="preview-item-value">
                {location || "Sin definir"}
              </span>
            </div>
          </div>

          <div className="ai-plan-box">
            <div className="ai-plan-title">✨ Planificación Inteligente</div>
            <div className="ai-plan-desc">
              Después de crear tu evento, nuestra IA generará un cronograma personalizado con tareas y sugerencias para que nada quede al azar.
            </div>
          </div>
        </div>
      </form>

      <div className="security-footer">
        🛡️ Tu información está protegida y solo tú puedes ver tus eventos.
      </div>
    </div>
  );
};

export default CreateEventPage;
