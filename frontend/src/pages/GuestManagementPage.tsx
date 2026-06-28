import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Guest, RSVPStatus, GuestGroup } from '../types';
import './GuestManagementPage.css';

// Evento vinculado a esta lista de invitados.
// Cuando se integre el backend se leerá desde useParams().eventId
// y se hará fetch de los datos reales.
const MOCK_EVENT = {
  id: 'evt-1',
  name: 'Boda de Juan & Ana',
  date: '20 de Julio, 2025',
  location: 'Hacienda Los Olivos',
};

// Colores de avatar — se asignan por hash del nombre
const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];
function avatarColor(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

const GROUP_LABELS: Record<GuestGroup, string> = {
  familia: 'Familia',
  amigos: 'Amigos',
  trabajo: 'Trabajo',
  otros: 'Otros',
};

const STATUS_CONFIG: Record<RSVPStatus, { label: string; icon: string }> = {
  confirmado: { label: 'Confirmado', icon: '✓' },
  pendiente:  { label: 'Pendiente',  icon: '⏱' },
  rechazado:  { label: 'Rechazado',  icon: '✗' },
};

// Datos de ejemplo vinculados al evento MOCK_EVENT.id
const initialGuests: Guest[] = [
  { id: 'g-1',  eventId: 'evt-1', name: 'Ana María Flores',  email: 'ana.flores@email.com',      rsvpStatus: 'confirmado', group: 'familia', invitationDate: '02 May, 2025' },
  { id: 'g-2',  eventId: 'evt-1', name: 'Carlos López',      email: 'carlos.lopez@email.com',    rsvpStatus: 'pendiente',  group: 'amigos',  invitationDate: '02 May, 2025' },
  { id: 'g-3',  eventId: 'evt-1', name: 'Lucía Martínez',    email: 'lucia.martinez@email.com',  rsvpStatus: 'confirmado', group: 'familia', invitationDate: '02 May, 2025' },
  { id: 'g-4',  eventId: 'evt-1', name: 'Pedro Rodríguez',   email: 'pedro.rodriguez@email.com', rsvpStatus: 'rechazado',  group: 'trabajo', invitationDate: '03 May, 2025' },
  { id: 'g-5',  eventId: 'evt-1', name: 'María González',    email: 'maria.gonzalez@email.com',  rsvpStatus: 'pendiente',  group: 'amigos',  invitationDate: '03 May, 2025' },
  { id: 'g-6',  eventId: 'evt-1', name: 'Jorge Ramírez',     email: 'jorge.ramirez@email.com',   rsvpStatus: 'confirmado', group: 'trabajo', invitationDate: '04 May, 2025' },
  { id: 'g-7',  eventId: 'evt-1', name: 'Sofía Hernández',   email: 'sofia.hernandez@email.com', rsvpStatus: 'pendiente',  group: 'familia', invitationDate: '04 May, 2025' },
  { id: 'g-8',  eventId: 'evt-1', name: 'Diego Vargas',      email: 'diego.vargas@email.com',    rsvpStatus: 'rechazado',  group: 'amigos',  invitationDate: '04 May, 2025' },
  { id: 'g-9',  eventId: 'evt-1', name: 'Carmen Ruiz',       email: 'carmen.ruiz@email.com',     rsvpStatus: 'confirmado', group: 'familia', invitationDate: '05 May, 2025' },
  { id: 'g-10', eventId: 'evt-1', name: 'Rafael Morales',    email: 'rafael.morales@email.com',  rsvpStatus: 'pendiente',  group: 'amigos',  invitationDate: '05 May, 2025' },
  { id: 'g-11', eventId: 'evt-1', name: 'Isabella Torres',   email: 'isabella.torres@email.com', rsvpStatus: 'confirmado', group: 'trabajo', invitationDate: '06 May, 2025' },
  { id: 'g-12', eventId: 'evt-1', name: 'Luis Mendoza',      email: 'luis.mendoza@email.com',    rsvpStatus: 'pendiente',  group: 'otros',   invitationDate: '06 May, 2025' },
];

const PER_PAGE_OPTIONS = [5, 10, 20];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Genera el array de páginas con elipsis para la paginación
function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '...')[] = [1];
  if (current > 3) out.push('...');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) out.push(p);
  if (current < total - 2) out.push('...');
  out.push(total);
  return out;
}

function GuestManagementPage() {
  const [guests, setGuests]           = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterGroup,  setFilterGroup]  = useState('todos');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modales
  const [isAddOpen,  setIsAddOpen]  = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  // Form agregar invitado
  const [formName,  setFormName]  = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGroup, setFormGroup] = useState<GuestGroup>('familia');

  // Importación masiva
  const [bulkRaw, setBulkRaw] = useState('');

  // Estado para impresión de lista de puerta
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Parseo de bulkRawck
  const [alertMsg,  setAlertMsg]  = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // ── Métricas del evento ──────────────────────────────────
  const confirmedCount  = guests.filter(g => g.rsvpStatus === 'confirmado').length;
  const pendingCount    = guests.filter(g => g.rsvpStatus === 'pendiente').length;
  const rejectedCount   = guests.filter(g => g.rsvpStatus === 'rechazado').length;
  const confirmRate     = guests.length ? (confirmedCount / guests.length) * 100 : 0;
  const pendingRate     = guests.length ? (pendingCount  / guests.length) * 100 : 0;
  const rejectedRate    = guests.length ? (rejectedCount / guests.length) * 100 : 0;

  // ── Filtrado ─────────────────────────────────────────────
  const filtered = guests.filter(g => {
    const q = searchQuery.toLowerCase();
    return (
      (g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)) &&
      (filterStatus === 'todos' || g.rsvpStatus === filterStatus) &&
      (filterGroup  === 'todos' || g.group === filterGroup)
    );
  });

  // ── Paginación ───────────────────────────────────────────
  const totalPages     = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage       = Math.min(currentPage, totalPages);
  const pageStart      = (safePage - 1) * itemsPerPage;
  const pageGuests     = filtered.slice(pageStart, pageStart + itemsPerPage);
  const pageList       = buildPageList(safePage, totalPages);
  const showingFrom    = filtered.length === 0 ? 0 : pageStart + 1;
  const showingTo      = Math.min(pageStart + itemsPerPage, filtered.length);

  function goToPage(p: number) {
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  }

  // ── Handlers ─────────────────────────────────────────────
  function handleAddGuest() {
    if (!formName.trim() || !formEmail.trim()) return;
    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    setGuests(prev => [...prev, {
      id: `g-${Date.now()}`,
      eventId: MOCK_EVENT.id,
      name: formName.trim(),
      email: formEmail.trim(),
      rsvpStatus: 'pendiente',
      group: formGroup,
      invitationDate: today,
    }]);
    setFormName(''); setFormEmail(''); setFormGroup('familia');
    setIsAddOpen(false);
    flash(`Invitado "${formName.trim()}" agregado.`);
  }

  function handleDelete(id: string) {
    setGuests(prev => prev.filter(g => g.id !== id));
  }

  const parsedEmails = bulkRaw.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
  const validEmails  = parsedEmails.filter(isValidEmail);

  function handleBulkImport() {
    if (!validEmails.length) return;
    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    setGuests(prev => [...prev, ...validEmails.map((email, i) => ({
      id: `g-bulk-${Date.now()}-${i}`,
      eventId: MOCK_EVENT.id,
      name: email.split('@')[0],
      email,
      rsvpStatus: 'pendiente' as RSVPStatus,
      group: 'otros' as GuestGroup,
      invitationDate: today,
    }))]);
    setBulkRaw('');
    setIsBulkOpen(false);
    flash(`${validEmails.length} correo${validEmails.length !== 1 ? 's' : ''} importado${validEmails.length !== 1 ? 's' : ''}.`);
  }

  function handleSendInvitations() {
    setIsRsvpOpen(false);
    flash(`📨 Invitaciones enviadas a ${pendingCount} invitados pendientes.`);
  }

  function flash(msg: string) {
    setAlertMsg(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  }

  return (
    <div className="guests animate-fade-in">

      {/* Breadcrumb + botón agregar */}
      <div className="guests__topbar">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__link">Eventos</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/" className="breadcrumb__link">{MOCK_EVENT.name}</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Invitados RSVP</span>
        </nav>
        <div className="guests__topbar-actions">
          <button className="bell-btn" type="button" aria-label="Notificaciones">
            🔔
            {pendingCount > 0 && <span className="bell-badge">{pendingCount}</span>}
          </button>
          <button className="btn-add-guests" onClick={() => setIsAddOpen(true)} type="button">
            + Agregar invitados
          </button>
        </div>
      </div>

      {/* Título */}
      <div className="guests__header">
        <h1 className="guests__title">👥 Invitados RSVP</h1>
        <p className="guests__subtitle">
          Gestiona la lista de invitados, envía invitaciones y realiza seguimiento de confirmaciones.
        </p>
      </div>

      {showAlert && (
        <div className="alert alert--success animate-fade-in-down">{alertMsg}</div>
      )}

      {/* Tarjeta del evento vinculado */}
      <div className="event-card">
        <div className="event-card__placeholder">🎊</div>

        <div className="event-card__info">
          <h2 className="event-card__name">{MOCK_EVENT.name}</h2>
          <p className="event-card__meta">📅 {MOCK_EVENT.date}</p>
          <p className="event-card__meta">📍 {MOCK_EVENT.location}</p>
        </div>

        <div className="event-card__divider" />

        <div className="event-card__stats">
          <div className="event-stat">
            <span className="event-stat__label">Invitados totales</span>
            <div className="event-stat__row">
              <span className="event-stat__num">{guests.length}</span>
            </div>
          </div>
          <div className="event-stat">
            <span className="event-stat__label">Confirmados</span>
            <div className="event-stat__row">
              <span className="event-stat__num">{confirmedCount}</span>
              <span className="event-stat__pct event-stat__pct--green">{confirmRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="event-stat">
            <span className="event-stat__label">Pendientes</span>
            <div className="event-stat__row">
              <span className="event-stat__num">{pendingCount}</span>
              <span className="event-stat__pct event-stat__pct--orange">{pendingRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="event-stat">
            <span className="event-stat__label">Rechazados</span>
            <div className="event-stat__row">
              <span className="event-stat__num">{rejectedCount}</span>
              <span className="event-stat__pct event-stat__pct--red">{rejectedRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Gauge SVG — tasa de confirmación */}
        <div className="event-card__gauge">
          <div className="gauge-svg-wrapper">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E2E8F0" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke="#10B981" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(confirmRate / 100) * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
                transform="rotate(-90 32 32)"
              />
            </svg>
          </div>
          <div className="gauge-text">
            <span className="gauge-pct">{confirmRate.toFixed(1)}%</span>
            <span className="gauge-label">Tasa de confirmación</span>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="guests__toolbar">
        <div className="guests__toolbar-left">
          <div className="search-box">
            <span className="search-box__icon">🔍</span>
            <input
              type="text"
              className="search-box__input"
              placeholder="Buscar invitado por nombre o correo..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="filter-select-wrapper">
            <span className="filter-select-wrapper__label">Estado:</span>
            <select className="filter-select" value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="todos">Todos</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <span className="filter-select-wrapper__label">Grupo:</span>
            <select className="filter-select" value={filterGroup}
              onChange={e => { setFilterGroup(e.target.value); setCurrentPage(1); }}>
              <option value="todos">Todos</option>
              <option value="familia">Familia</option>
              <option value="amigos">Amigos</option>
              <option value="trabajo">Trabajo</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="guests__toolbar-right">
          <button className="btn-print-door" onClick={() => setIsPrintPreviewOpen(true)} type="button">
            🖨️ Lista de Puerta
          </button>
          <button className="btn-import" onClick={() => setIsBulkOpen(true)} type="button">
            ↑ Importar lista
          </button>
          <button className="btn-send-rsvp" onClick={() => setIsRsvpOpen(true)} type="button">
            ✉ Enviar invitaciones
          </button>
        </div>
      </div>

      {/* Tabla de invitados */}
      <div className="guests__table-wrapper">
        <table className="guests__table">
          <thead>
            <tr>
              <th><input type="checkbox" className="table-checkbox" /></th>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>Grupo</th>
              <th>Estado RSVP</th>
              <th>Fecha de invitación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageGuests.map((guest, i) => {
              const cfg   = STATUS_CONFIG[guest.rsvpStatus];
              const color = avatarColor(guest.name);
              const initials = guest.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
              return (
                <tr key={guest.id} className="guests__row animate-fade-in-up"
                  style={{ animationDelay: `${i * 35}ms` }}>
                  <td><input type="checkbox" className="table-checkbox" /></td>
                  <td>
                    <div className="guest-name-cell">
                      <div className="guest-avatar" style={{ background: color }}>
                        {initials}
                      </div>
                      <span className="guest-name">{guest.name}</span>
                    </div>
                  </td>
                  <td><span className="guest-email">{guest.email}</span></td>
                  <td>
                    {guest.group && (
                      <span className={`group-badge group-badge--${guest.group}`}>
                        {GROUP_LABELS[guest.group]}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`rsvp-status rsvp-status--${guest.rsvpStatus}`}>
                      <span className={`rsvp-icon rsvp-icon--${guest.rsvpStatus}`}>
                        {cfg.icon}
                      </span>
                      {cfg.label}
                    </span>
                  </td>
                  <td><span className="invitation-date">{guest.invitationDate ?? '—'}</span></td>
                  <td>
                    <button
                      className="action-dots"
                      title="Opciones"
                      onClick={() => flash('Acciones de invitado en desarrollo.')}
                      type="button"
                    >
                      •••
                    </button>
                  </td>
                </tr>
              );
            })}
            {pageGuests.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty">
                  No se encontraron invitados con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination">
          <span className="pagination__info">
            Mostrando {showingFrom} a {showingTo} de {filtered.length} invitados
          </span>

          <div className="pagination__pages">
            <button className="page-btn" onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1} type="button">‹</button>

            {pageList.map((item, idx) =>
              item === '...'
                ? <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                : (
                  <button
                    key={item}
                    className={`page-btn ${item === safePage ? 'page-btn--active' : ''}`}
                    onClick={() => goToPage(item as number)}
                    type="button"
                  >
                    {item}
                  </button>
                )
            )}

            <button className="page-btn" onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages} type="button">›</button>
          </div>

          <div className="pagination__per-page">
            <span>Mostrar</span>
            <select className="per-page-select" value={itemsPerPage}
              onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>por página</span>
          </div>
        </div>
      </div>

      {/* ── Modal: agregar invitado ─────────────────────────── */}
      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Agregar invitado</h2>
              <button className="modal__close" onClick={() => setIsAddOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Nombre *</label>
                <input className="modal__input" type="text" placeholder="Nombre completo"
                  value={formName} onChange={e => setFormName(e.target.value)} />
              </div>
              <div className="modal__field">
                <label className="modal__label">Correo electrónico *</label>
                <input className="modal__input" type="email" placeholder="correo@ejemplo.com"
                  value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>
              <div className="modal__field">
                <label className="modal__label">Grupo</label>
                <select className="modal__select" value={formGroup}
                  onChange={e => setFormGroup(e.target.value as GuestGroup)}>
                  <option value="familia">Familia</option>
                  <option value="amigos">Amigos</option>
                  <option value="trabajo">Trabajo</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsAddOpen(false)} type="button">
                Cancelar
              </button>
              <button className="modal__btn modal__btn--submit" onClick={handleAddGuest}
                disabled={!formName.trim() || !formEmail.trim()} type="button">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: importar lista de correos ────────────────── */}
      {isBulkOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkOpen(false)}>
          <div className="modal modal--wide animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">↑ Importar lista de correos</h2>
              <button className="modal__close" onClick={() => setIsBulkOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Correos electrónicos</label>
                <span className="modal__hint">Separa con comas, punto y coma o saltos de línea.</span>
                <textarea className="modal__textarea"
                  placeholder={"juan@correo.com\nmaria@correo.com, pedro@empresa.com"}
                  value={bulkRaw} onChange={e => setBulkRaw(e.target.value)} />
              </div>
              {parsedEmails.length > 0 && (
                <div className="modal__field">
                  <label className="modal__label">Vista previa ({parsedEmails.length})</label>
                  <div className="bulk-preview">
                    {parsedEmails.map((email, i) => (
                      <div key={i} className={`bulk-preview__item bulk-preview__item--${isValidEmail(email) ? 'valid' : 'invalid'}`}>
                        <span>{isValidEmail(email) ? '✓' : '✗'}</span>
                        <span>{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsBulkOpen(false)} type="button">
                Cancelar
              </button>
              <button className="modal__btn modal__btn--submit" onClick={handleBulkImport}
                disabled={validEmails.length === 0} type="button">
                Importar {validEmails.length} correo{validEmails.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: vista previa de invitación RSVP ──────────── */}
      {isRsvpOpen && (
        <div className="modal-overlay" onClick={() => setIsRsvpOpen(false)}>
          <div className="modal modal--wide animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">✉ Vista previa — Invitación RSVP</h2>
              <button className="modal__close" onClick={() => setIsRsvpOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
                Este correo se enviará a los <strong>{pendingCount} invitados pendientes</strong>.
                Cada enlace es único por destinatario.
              </p>
              <div className="rsvp-preview">
                <div className="rsvp-preview__meta">
                  <span><strong>De:</strong> NexEvent &lt;invitaciones@nexevent.com&gt;</span>
                  <span><strong>Para:</strong> [nombre del invitado]</span>
                  <span><strong>Asunto:</strong> Tienes una invitación — {MOCK_EVENT.name} 💌</span>
                </div>
                <div className="rsvp-preview__body">
                  Hola <strong>[Nombre]</strong>, 👋<br /><br />
                  Tienes una invitación para <strong>{MOCK_EVENT.name}</strong> el{' '}
                  <strong>{MOCK_EVENT.date}</strong> en {MOCK_EVENT.location}.<br /><br />
                  Confirma tu asistencia:
                  <div className="rsvp-preview__btns">
                    <button className="rsvp-btn rsvp-btn--accept" type="button">✅ Asistiré</button>
                    <button className="rsvp-btn rsvp-btn--decline" type="button">❌ No Asistiré</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsRsvpOpen(false)} type="button">
                Cancelar
              </button>
              <button className="modal__btn modal__btn--submit" onClick={handleSendInvitations}
                disabled={pendingCount === 0} type="button">
                Enviar a {pendingCount} invitado{pendingCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Imprimir Lista de Puerta ──────────── */}
      {isPrintPreviewOpen && (
        <div className="modal-overlay" onClick={() => setIsPrintPreviewOpen(false)}>
          <div className="modal modal--print animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">🖨️ Vista previa — Lista de Puerta</h2>
              <button className="modal__close" onClick={() => setIsPrintPreviewOpen(false)} type="button">✕</button>
            </div>
            
            <div className="modal__body" style={{ background: '#f4f4f5', padding: '2rem' }}>
              <div className="print-container">
                {/* Contenido a imprimir */}
                <div className="print-header">
                  <h1>{MOCK_EVENT.name} - Lista de Acceso</h1>
                  <p>📍 {MOCK_EVENT.location} | 📅 {MOCK_EVENT.date}</p>
                  <p>Total confirmados: {guests.filter(g => g.rsvpStatus === 'confirmado').length}</p>
                </div>

                <table className="print-table">
                  <thead>
                    <tr>
                      <th>✓</th>
                      <th>Invitado</th>
                      <th>Grupo</th>
                      <th>Mesa</th>
                      <th>Firma / Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.filter(g => g.rsvpStatus === 'confirmado').map((guest, idx) => (
                      <tr key={guest.id}>
                        <td className="print-table__check"></td>
                        <td>
                          <strong>{guest.name}</strong><br />
                          <small>{guest.email}</small>
                        </td>
                        <td>{guest.group || '-'}</td>
                        <td>{guest.table || '-'}</td>
                        <td className="print-table__notes"></td>
                      </tr>
                    ))}
                    {guests.filter(g => g.rsvpStatus === 'confirmado').length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                          No hay invitados confirmados aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal__footer" style={{ justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Solo se muestran invitados "Confirmados".</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="modal__btn modal__btn--cancel" onClick={() => setIsPrintPreviewOpen(false)} type="button">
                  Cerrar
                </button>
                <button className="modal__btn modal__btn--submit" onClick={() => window.print()} type="button">
                  🖨️ Imprimir Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GuestManagementPage;
