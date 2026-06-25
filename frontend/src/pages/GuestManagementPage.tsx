import { useState } from 'react';
import type { Guest, RSVPStatus } from '../types';
import './GuestManagementPage.css';

// ─── Datos de ejemplo ──────────────────────────────────────────
const initialGuests: Guest[] = [
  { id: 'g-1', name: 'María García López', email: 'maria.garcia@email.com', phone: '+51 955 123 456', rsvpStatus: 'confirmado', table: 'Mesa 1' },
  { id: 'g-2', name: 'Carlos Rodríguez', email: 'carlos.rod@email.com', phone: '+51 955 234 567', rsvpStatus: 'confirmado', table: 'Mesa 1' },
  { id: 'g-3', name: 'Ana López Martínez', email: 'ana.lopez@email.com', rsvpStatus: 'pendiente', table: 'Mesa 2' },
  { id: 'g-4', name: 'Roberto Sánchez', email: 'roberto.s@email.com', phone: '+51 955 345 678', rsvpStatus: 'confirmado', table: 'Mesa 2' },
  { id: 'g-5', name: 'Laura Fernández', email: 'laura.f@email.com', rsvpStatus: 'rechazado' },
  { id: 'g-6', name: 'Diego Morales', email: 'diego.morales@email.com', phone: '+51 955 456 789', rsvpStatus: 'pendiente', table: 'Mesa 3' },
  { id: 'g-7', name: 'Sofía Herrera', email: 'sofia.h@email.com', rsvpStatus: 'confirmado', table: 'Mesa 3' },
  { id: 'g-8', name: 'Andrés Jiménez', email: 'andres.j@email.com', phone: '+51 955 567 890', rsvpStatus: 'pendiente', table: 'Mesa 4' },
  { id: 'g-9', name: 'Patricia Ruiz', email: 'patricia.r@email.com', rsvpStatus: 'rechazado' },
  { id: 'g-10', name: 'Fernando Torres', email: 'fernando.t@email.com', phone: '+51 955 678 901', rsvpStatus: 'confirmado', table: 'Mesa 4' },
];

const statusLabels: Record<RSVPStatus, string> = {
  confirmado: 'Confirmado',
  pendiente: 'Pendiente',
  rechazado: 'Rechazado',
};

// Valida que un string tenga formato de correo básico
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function GuestManagementPage() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Modal: agregar invitado individual
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTable, setFormTable] = useState('');

  // Modal: importación masiva de correos (RF09)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkEmailsRaw, setBulkEmailsRaw] = useState('');

  // Modal: vista previa de invitación RSVP (RF10)
  const [isRsvpPreviewOpen, setIsRsvpPreviewOpen] = useState(false);

  // Feedback de envío
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ── Contadores ──────────────────────────────────────────────
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'confirmado').length;
  const pendingCount   = guests.filter((g) => g.rsvpStatus === 'pendiente').length;
  const rejectedCount  = guests.filter((g) => g.rsvpStatus === 'rechazado').length;

  // ── Filtrado ─────────────────────────────────────────────────
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ── Lógica: agregar invitado individual ──────────────────────
  const handleAddGuest = () => {
    if (!formName.trim() || !formEmail.trim()) return;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || undefined,
      rsvpStatus: 'pendiente',
      table: formTable.trim() || undefined,
    };

    setGuests((prev) => [...prev, newGuest]);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormTable('');
    setIsAddModalOpen(false);

    showFeedback('Invitado agregado correctamente.');
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // ── RF10: Envío de invitaciones RSVP ────────────────────────
  // Simula el envío; en producción dispararía un endpoint de email
  const handleSendInvitations = () => {
    setIsRsvpPreviewOpen(false);
    showFeedback(`📨 Invitaciones enviadas a ${pendingCount} invitado${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}.`);
  };

  function showFeedback(msg: string) {
    setSuccessMessage(msg);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 4000);
  }

  // ── RF09: Parseo de correos en bulk ─────────────────────────
  // Separa por coma, punto y coma o salto de línea
  const parsedEmails = bulkEmailsRaw
    .split(/[\n,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);

  const handleBulkImport = () => {
    const validEmails = parsedEmails.filter(isValidEmail);
    if (validEmails.length === 0) return;

    const newGuests: Guest[] = validEmails.map((email, i) => ({
      id: `g-bulk-${Date.now()}-${i}`,
      name: email.split('@')[0], // nombre provisional hasta que el invitado confirme datos
      email,
      rsvpStatus: 'pendiente',
    }));

    setGuests((prev) => [...prev, ...newGuests]);
    setBulkEmailsRaw('');
    setIsBulkModalOpen(false);

    showFeedback(`✅ ${validEmails.length} correo${validEmails.length !== 1 ? 's' : ''} importado${validEmails.length !== 1 ? 's' : ''} correctamente.`);
  };

  return (
    <div className="guests animate-fade-in">

      {/* ── Encabezado ──────────────────────────────────────── */}
      <div className="guests__header">
        <div className="guests__header-text">
          <h1 className="guests__title">Gestión de Invitados</h1>
          <p className="guests__subtitle">
            Administra tu lista de invitados y envía invitaciones RSVP por correo
          </p>
        </div>
      </div>

      {/* ── Alerta de feedback ──────────────────────────────── */}
      {showSuccessAlert && (
        <div className="alert alert--success animate-fade-in-down">
          {successMessage}
        </div>
      )}

      {/* ── Contadores ──────────────────────────────────────── */}
      <div className="guests__counters">
        <div className="guests__counter guests__counter--total">
          <span className="guests__counter-icon">👥</span>
          <div className="guests__counter-info">
            <span className="guests__counter-value">{guests.length}</span>
            <span className="guests__counter-label">Total</span>
          </div>
        </div>
        <div className="guests__counter guests__counter--confirmed">
          <span className="guests__counter-icon">✅</span>
          <div className="guests__counter-info">
            <span className="guests__counter-value">{confirmedCount}</span>
            <span className="guests__counter-label">Confirmados</span>
          </div>
        </div>
        <div className="guests__counter guests__counter--pending">
          <span className="guests__counter-icon">⏳</span>
          <div className="guests__counter-info">
            <span className="guests__counter-value">{pendingCount}</span>
            <span className="guests__counter-label">Pendientes</span>
          </div>
        </div>
        <div className="guests__counter guests__counter--rejected">
          <span className="guests__counter-icon">❌</span>
          <div className="guests__counter-info">
            <span className="guests__counter-value">{rejectedCount}</span>
            <span className="guests__counter-label">Rechazados</span>
          </div>
        </div>
      </div>

      {/* ── Barra de herramientas ────────────────────────────── */}
      <div className="guests__toolbar">
        <div className="guests__toolbar-left">
          <div className="guests__search-wrapper">
            <span className="guests__search-icon">🔍</span>
            <input
              type="text"
              className="guests__search-input"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="guests__filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>

        <div className="guests__toolbar-right">
          {/* RF10: abrir vista previa del email RSVP antes de enviar */}
          <button
            className="guests__btn guests__btn--secondary"
            onClick={() => setIsRsvpPreviewOpen(true)}
            type="button"
          >
            📨 Enviar Invitaciones
          </button>

          {/* RF09: importar lista de correos */}
          <button
            className="guests__btn guests__btn--secondary"
            onClick={() => setIsBulkModalOpen(true)}
            type="button"
          >
            📋 Importar correos
          </button>

          <button
            className="guests__btn guests__btn--primary"
            onClick={() => setIsAddModalOpen(true)}
            type="button"
          >
            ➕ Agregar Invitado
          </button>
        </div>
      </div>

      {/* ── Tabla de invitados ───────────────────────────────── */}
      <div className="guests__table-wrapper">
        <table className="guests__table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Estado RSVP</th>
              <th>Mesa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest, index) => (
              <tr
                key={guest.id}
                className="guests__row animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <td>
                  <div className="guests__name-cell">
                    <div className="guests__avatar">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="guests__name">{guest.name}</span>
                  </div>
                </td>
                <td>
                  <span className="guests__email">{guest.email}</span>
                </td>
                <td>
                  <span className={`rsvp-badge rsvp-badge--${guest.rsvpStatus}`}>
                    {statusLabels[guest.rsvpStatus]}
                  </span>
                </td>
                <td>
                  <span className="guests__table-name">{guest.table || '—'}</span>
                </td>
                <td>
                  <div className="guests__actions">
                    <button className="guests__action-btn guests__action-btn--edit" title="Editar" type="button">
                      ✏️
                    </button>
                    <button
                      className="guests__action-btn guests__action-btn--delete"
                      title="Eliminar"
                      onClick={() => handleDeleteGuest(guest.id)}
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={5} className="guests__empty-row">
                  <span className="guests__empty-icon">👥</span>
                  No se encontraron invitados con los filtros actuales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal: agregar invitado individual ─────────────── */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Agregar Invitado</h2>
              <button className="modal__close" onClick={() => setIsAddModalOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Nombre *</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Nombre completo"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Correo Electrónico *</label>
                <input
                  type="email"
                  className="modal__input"
                  placeholder="correo@ejemplo.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Teléfono (opcional)</label>
                <input
                  type="tel"
                  className="modal__input"
                  placeholder="+51 955 123 456"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Mesa (opcional)</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Ej: Mesa 5"
                  value={formTable}
                  onChange={(e) => setFormTable(e.target.value)}
                />
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsAddModalOpen(false)} type="button">
                Cancelar
              </button>
              <button
                className="modal__btn modal__btn--submit"
                onClick={handleAddGuest}
                disabled={!formName.trim() || !formEmail.trim()}
                type="button"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: importación masiva de correos (RF09) ─────── */}
      {isBulkModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal modal--wide animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">📋 Importar lista de correos</h2>
              <button className="modal__close" onClick={() => setIsBulkModalOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <div className="modal__field">
                <label className="modal__label">Lista de correos electrónicos</label>
                <span className="modal__hint">
                  Separa los correos con comas, punto y coma o saltos de línea.
                </span>
                <textarea
                  className="modal__textarea"
                  placeholder={"juan@correo.com\nmaria@correo.com, pedro@empresa.com"}
                  value={bulkEmailsRaw}
                  onChange={(e) => setBulkEmailsRaw(e.target.value)}
                />
              </div>

              {/* Vista previa de correos ingresados */}
              {parsedEmails.length > 0 && (
                <div className="modal__field">
                  <label className="modal__label">Vista previa ({parsedEmails.length} correo{parsedEmails.length !== 1 ? 's' : ''})</label>
                  <div className="bulk-preview">
                    {parsedEmails.map((email, i) => (
                      <div
                        key={i}
                        className={`bulk-preview__item ${isValidEmail(email) ? 'bulk-preview__item--valid' : 'bulk-preview__item--invalid'}`}
                      >
                        <span>{isValidEmail(email) ? '✓' : '✗'}</span>
                        <span>{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsBulkModalOpen(false)} type="button">
                Cancelar
              </button>
              <button
                className="modal__btn modal__btn--submit"
                onClick={handleBulkImport}
                disabled={parsedEmails.filter(isValidEmail).length === 0}
                type="button"
              >
                Importar {parsedEmails.filter(isValidEmail).length} correo{parsedEmails.filter(isValidEmail).length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: vista previa de email RSVP (RF10) ────────── */}
      {isRsvpPreviewOpen && (
        <div className="modal-overlay" onClick={() => setIsRsvpPreviewOpen(false)}>
          <div className="modal modal--wide animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">📨 Vista previa — Invitación RSVP</h2>
              <button className="modal__close" onClick={() => setIsRsvpPreviewOpen(false)} type="button">✕</button>
            </div>
            <div className="modal__body">
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
                Este correo se enviará a los <strong>{pendingCount} invitados con estado pendiente</strong>.
                Cada enlace es dinámico y único por destinatario.
              </p>

              {/* Preview del email que recibirá el invitado */}
              <div className="rsvp-preview">
                <div className="rsvp-preview__email-header">
                  <span><strong>De:</strong> NexEvent &lt;invitaciones@nexevent.com&gt;</span>
                  <span><strong>Para:</strong> [nombre del invitado]</span>
                  <span><strong>Asunto:</strong> Tienes una invitación para Boda García – López 💌</span>
                </div>
                <div className="rsvp-preview__email-body">
                  <p className="rsvp-preview__greeting">
                    Hola <strong>[Nombre del invitado]</strong>, 👋<br /><br />
                    Tienes una invitación especial para el evento <strong>Boda García – López</strong>
                    {' '}el próximo <strong>15 de noviembre, 2025</strong> en el Salón Royal.<br /><br />
                    Por favor, confirma tu asistencia haciendo clic en uno de los botones:
                  </p>
                  <div className="rsvp-preview__actions">
                    <button className="rsvp-btn rsvp-btn--accept" type="button">
                      ✅ Asistiré
                    </button>
                    <button className="rsvp-btn rsvp-btn--decline" type="button">
                      ❌ No Asistiré
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__btn modal__btn--cancel" onClick={() => setIsRsvpPreviewOpen(false)} type="button">
                Cancelar
              </button>
              <button
                className="modal__btn modal__btn--submit"
                onClick={handleSendInvitations}
                disabled={pendingCount === 0}
                type="button"
              >
                Enviar a {pendingCount} invitado{pendingCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GuestManagementPage;
