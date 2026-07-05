import { useState } from 'react';
import type { Guest, RSVPStatus } from '../types';

const initialGuests: Guest[] = [
  { id: 'g-1', name: 'María García López', email: 'maria.garcia@email.com', phone: '+52 55 1234 5678', rsvpStatus: 'confirmado', table: 'Mesa 1' },
  { id: 'g-2', name: 'Carlos Rodríguez', email: 'carlos.rod@email.com', phone: '+52 55 2345 6789', rsvpStatus: 'confirmado', table: 'Mesa 1' },
  { id: 'g-3', name: 'Ana López Martínez', email: 'ana.lopez@email.com', rsvpStatus: 'pendiente', table: 'Mesa 2' },
  { id: 'g-4', name: 'Roberto Sánchez', email: 'roberto.s@email.com', phone: '+52 55 3456 7890', rsvpStatus: 'confirmado', table: 'Mesa 2' },
  { id: 'g-5', name: 'Laura Fernández', email: 'laura.f@email.com', rsvpStatus: 'rechazado' },
  { id: 'g-6', name: 'Diego Morales', email: 'diego.morales@email.com', phone: '+52 55 4567 8901', rsvpStatus: 'pendiente', table: 'Mesa 3' },
  { id: 'g-7', name: 'Sofía Herrera', email: 'sofia.h@email.com', rsvpStatus: 'confirmado', table: 'Mesa 3' },
  { id: 'g-8', name: 'Andrés Jiménez', email: 'andres.j@email.com', phone: '+52 55 5678 9012', rsvpStatus: 'pendiente', table: 'Mesa 4' },
  { id: 'g-9', name: 'Patricia Ruiz', email: 'patricia.r@email.com', rsvpStatus: 'rechazado' },
  { id: 'g-10', name: 'Fernando Torres', email: 'fernando.t@email.com', phone: '+52 55 6789 0123', rsvpStatus: 'confirmado', table: 'Mesa 4' },
];

const statusLabels: Record<RSVPStatus, string> = {
  confirmado: 'Confirmado',
  pendiente: 'Pendiente',
  rechazado: 'Rechazado',
};

function GuestManagementPage() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTable, setFormTable] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'confirmado').length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pendiente').length;
  const rejectedCount = guests.filter((g) => g.rsvpStatus === 'rechazado').length;

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    setIsModalOpen(false);
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSendInvitations = () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 4000);
  };

  return (
    <div className="guests animate-fade-in">
      <div className="guests__header">
        <div className="guests__header-text">
          <h1 className="guests__title">Gestión de Invitados</h1>
          <p className="guests__subtitle">
            Administra tu lista de invitados, confirmaciones y asignación de mesas
          </p>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="alert alert--success animate-fade-in-down">
          ✅ Las invitaciones han sido enviadas exitosamente a {pendingCount} invitados pendientes.
        </div>
      )}

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
            <option value="confirmado">Confirmado</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="guests__toolbar-right">
          <button
            className="guests__btn guests__btn--secondary"
            onClick={handleSendInvitations}
            type="button"
          >
            📨 Enviar Invitaciones
          </button>
          <button
            className="guests__btn guests__btn--primary"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            ➕ Agregar Invitado
          </button>
        </div>
      </div>

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
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td>
                  <div className="guests__name-cell">
                    <div className="guests__avatar">
                      {guest.name.charAt(0)}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h2 className="modal__title">Agregar Invitado</h2>
              <button
                className="modal__close"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                ✕
              </button>
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
                  placeholder="+52 55 1234 5678"
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
              <button
                className="modal__btn modal__btn--cancel"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
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
    </div>
  );
}

export default GuestManagementPage;
