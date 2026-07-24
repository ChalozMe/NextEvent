import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { eventService, type EventTask } from "../services/eventService";
import { venueService, type EventVenueReservation } from "../services/venueService";
import type { NexEvent } from "../types";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState<NexEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NexEvent | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [venueReservations, setVenueReservations] = useState<EventVenueReservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse ISO or YYYY-MM-DD date strings reliably without UTC midnight off-by-one shifts
  const parseEventDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanStr.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const calculateDaysRemainingInfo = (dateStr?: string): { days: number; statusText: string; isPast: boolean; isToday: boolean } => {
    const evtDate = parseEventDate(dateStr);
    if (!evtDate) return { days: 0, statusText: 'Fecha no definida', isPast: false, isToday: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDateMidnight = new Date(evtDate.getFullYear(), evtDate.getMonth(), evtDate.getDate());
    eventDateMidnight.setHours(0, 0, 0, 0);

    const diffTime = eventDateMidnight.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return { days: diffDays, statusText: 'para la fecha del evento', isPast: false, isToday: false };
    } else if (diffDays === 0) {
      return { days: 0, statusText: '¡Hoy es el día del evento! 🎉', isPast: false, isToday: true };
    } else {
      const pastDays = Math.abs(diffDays);
      return { days: 0, statusText: `Finalizado (hace ${pastDays} ${pastDays === 1 ? 'día' : 'días'})`, isPast: true, isToday: false };
    }
  };

  // Calculations for active event budget
  const budgetPercent = selectedEvent && selectedEvent.budget > 0
    ? Math.round((selectedEvent.budgetUsed / selectedEvent.budget) * 100)
    : 0;

  const budgetBalance = selectedEvent ? selectedEvent.budget - selectedEvent.budgetUsed : 0;
  const isOverBudget = budgetBalance < 0;
  const daysInfo = calculateDaysRemainingInfo(selectedEvent?.date);

  const guestPercent =
    selectedEvent && selectedEvent.guestsTotal > 0
      ? Math.round(
        (selectedEvent.guestsConfirmed / selectedEvent.guestsTotal) * 100
      )
      : 0;

  // Real Task Calculations from Database
  const tasksCompleted = tasks.filter(
    t => t.status.toUpperCase() === "COMPLETED" || t.status.toUpperCase() === "COMPLETADA"
  ).length;

  const tasksInProgress = tasks.filter(
    t => t.status.toUpperCase() === "IN_PROGRESS" || t.status.toUpperCase() === "PROGRESO"
  ).length;

  const tasksPending = tasks.filter(
    t => t.status.toUpperCase() === "PENDING" || t.status.toUpperCase() === "PENDIENTE"
  ).length;

  const tasksTotal = tasks.length;
  const taskPercent = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  // Sorted tasks for Próximas Tareas (uncompleted tasks first)
  const upcomingTasks = [...tasks].sort((a, b) => {
    const aDone = a.status.toUpperCase() === "COMPLETED" || a.status.toUpperCase() === "COMPLETADA";
    const bDone = b.status.toUpperCase() === "COMPLETED" || b.status.toUpperCase() === "COMPLETADA";
    if (aDone === bDone) return 0;
    return aDone ? 1 : -1;
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);

        if (data.length > 0) {
          setSelectedEvent(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;

    const loadTasks = async () => {
      try {
        const data = await eventService.getTasks(selectedEvent.id);
        setTasks(data);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
        setTasks([]);
      }
    };

    const loadVenueReservations = async () => {
      try {
        const res = await venueService.getEventReservations(selectedEvent.id);
        setVenueReservations(res);
      } catch (err) {
        console.error("Error al cargar reservas del local:", err);
        setVenueReservations([]);
      }
    };

    loadTasks();
    loadVenueReservations();
  }, [selectedEvent]);

  if (loading) {
    return <div className="dashboard-container"><p style={{ padding: '3rem', textAlign: 'center' }}>Cargando eventos de tu cuenta...</p></div>;
  }

  if (events.length === 0) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            gap: "1rem",
          }}
        >
          <h2>Aún no tienes eventos registrados</h2>
          <p>Crea tu primer evento para comenzar la planificación inteligente.</p>
          <button
            className="btn-new-event"
            onClick={() => navigate("/events/new")}
          >
            <span>+</span> Crear Primer Evento
          </button>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-header__welcome">
          <h1>¡Qué gusto verte, {user?.fullName || 'Organizador'}! 👋</h1>
          <p>Aquí tienes el resumen ejecutivo de tu evento en Arequipa.</p>
        </div>
        <div className="dashboard-header__actions">
          <select
            value={selectedEvent?.id}
            onChange={(e) => {
              const event = events.find(ev => ev.id === e.target.value);
              if (event) setSelectedEvent(event);
            }}
            style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontWeight: '600', color: '#4F46E5', cursor: 'pointer' }}
          >
            {events.map(event => (
              <option key={event.id} value={event.id}>
                🎉 {event.name} ({event.type})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="kpi-grid">
        {/* Tareas Completadas (Database Driven) */}
        <div className="kpi-card">
          <div className="kpi-card__header">
            <div className="kpi-card__title-group">
              <div className="kpi-icon kpi-icon--purple">📋</div>
              <span className="kpi-title">Tareas Completadas</span>
            </div>
            <span className="kpi-more">•••</span>
          </div>
          <div className="kpi-value">{taskPercent}%</div>
          <div className="kpi-footer">
            <span>{tasksCompleted} de {tasksTotal} tareas</span>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill kpi-progress-fill--purple" style={{ width: `${taskPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Invitados Confirmados (Intact) */}
        <div className="kpi-card">
          <div className="kpi-card__header">
            <div className="kpi-card__title-group">
              <div className="kpi-icon kpi-icon--green">👥</div>
              <span className="kpi-title">Invitados Confirmados</span>
            </div>
            <span className="kpi-more">•••</span>
          </div>
          <div className="kpi-value">{selectedEvent.guestsConfirmed}</div>
          <div className="kpi-footer">
            <span>de {selectedEvent.guestsTotal} aforo máximo</span>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill kpi-progress-fill--green" style={{ width: `${guestPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Días Restantes */}
        <div className="kpi-card">
          <div className="kpi-card__header">
            <div className="kpi-card__title-group">
              <div className="kpi-icon kpi-icon--orange">📅</div>
              <span className="kpi-title">Días Restantes</span>
            </div>
            <span className="kpi-more">•••</span>
          </div>
          <div className="kpi-value">{daysInfo.days}</div>
          <div className="kpi-footer">
            <span style={{ color: daysInfo.isPast ? '#94A3B8' : daysInfo.isToday ? '#10B981' : '#475569', fontWeight: daysInfo.isToday ? '700' : 'normal' }}>
              {daysInfo.statusText}
            </span>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill kpi-progress-fill--orange" style={{ width: `${Math.min(daysInfo.days, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Presupuesto Utilizado / Balance (Dynamic venue reservation integration) */}
        <div className="kpi-card">
          <div className="kpi-card__header">
            <div className="kpi-card__title-group">
              <div className="kpi-icon kpi-icon--blue">💰</div>
              <span className="kpi-title">Presupuesto Reservas</span>
            </div>
            <span className="kpi-more">•••</span>
          </div>
          <div className="kpi-value" style={{ color: isOverBudget ? '#EF4444' : '#0F172A' }}>
            S/ {selectedEvent.budgetUsed.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-footer">
            {isOverBudget ? (
              <span style={{ color: '#EF4444', fontWeight: '600' }}>
                ⚠️ Excedido por S/ {Math.abs(budgetBalance).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span style={{ color: '#10B981', fontWeight: '600' }}>
                ✅ Restante S/ {budgetBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            )}
            <div className="kpi-progress-bar">
              <div
                className={`kpi-progress-fill ${isOverBudget ? 'kpi-progress-fill--orange' : 'kpi-progress-fill--blue'}`}
                style={{ width: `${Math.min(budgetPercent, 100)}%`, background: isOverBudget ? '#EF4444' : undefined }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="grid-left">
          {/* Resumen del Evento Actual */}
          <div className="dash-card">
            <h2 className="dash-card__title">Resumen del Evento Actual</h2>
            <div className="event-summary">
              <div className="event-details">
                <div className="event-image">
                  <img
                    src={
                      selectedEvent.coverImage ||
                      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    }
                    alt={selectedEvent.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                  />
                </div>
                <div className="event-info">
                  <h3>{selectedEvent.name}</h3>
                  <span className="badge-planning" style={{ textTransform: 'capitalize' }}>
                    {selectedEvent.status}
                  </span>
                  <div className="event-meta">
                    <span>📅 {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'} </span>
                    <span>📍 {selectedEvent.location || "Arequipa"}</span>
                    <span>👥 {selectedEvent.capacity} aforo</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Task Breakdown Chart */}
              <div className="event-chart">
                <div className="donut-chart">
                  <div className="donut-inner">{taskPercent}%</div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--green"></span>
                      Completadas
                    </div>
                    <span className="legend-value">{tasksCompleted}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--blue"></span>
                      En progreso
                    </div>
                    <span className="legend-value">{tasksInProgress}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--orange"></span>
                      Pendientes
                    </div>
                    <span className="legend-value">{tasksPending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso de Tareas Chart */}
          <div className="dash-card">
            <h2 className="dash-card__title">Curva de Avance del Cronograma</h2>
            <div className="line-chart-area">
              <div className="line-chart-labels-y">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <svg className="line-chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                <polyline fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5" points="0,200 100,150 200,100 300,50 400,25 500,0" />

                <path d={`M 0 200 Q 150 ${200 - (taskPercent * 1.5)} 300 ${200 - (taskPercent * 1.8)} L 300 200 Z`} fill="url(#gradient)" />
                <polyline fill="none" stroke="#6366F1" strokeWidth="2.5" points={`0,200 150,${200 - (taskPercent * 1.5)} 300,${200 - (taskPercent * 1.8)}`} />

                <circle cx="300" cy={200 - (taskPercent * 1.8)} r="5" fill="#6366F1" />
                <rect x="275" y={170 - (taskPercent * 1.8)} width="50" height="22" rx="6" fill="#6366F1" />
                <text x="300" y={185 - (taskPercent * 1.8)} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{taskPercent}%</text>

                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="line-chart-labels-x">
                <span>Inicio</span>
                <span>Fase 1</span>
                <span>Fase 2</span>
                <span>Fase 3</span>
                <span>Hoy</span>
                <span>Evento</span>
              </div>
            </div>
            <div className="line-chart-legend">
              <div className="line-legend-item">
                <div className="line-solid"></div>
                Progreso real acumulado ({taskPercent}%)
              </div>
              <div className="line-legend-item">
                <div className="line-dashed"></div>
                Progreso planificado
              </div>
            </div>
          </div>

          {/* Locales Reservados para este Evento (Nuevo Box) */}
          <div className="dash-card">
            <h2 className="dash-card__title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📍 Locales Reservados para este Evento</span>
              <button
                className="dash-card__link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', color: '#4F46E5' }}
                onClick={() => navigate('/venues')}
              >
                + Explorar locales →
              </button>
            </h2>

            {venueReservations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: '#F8FAFC',
                borderRadius: '0.75rem',
                border: '1px dashed #CBD5E1',
                margin: '0.5rem 0'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏰</div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#1E293B', fontWeight: '700' }}>Aún no has reservado un local para este evento</h4>
                <p style={{ margin: '0 0 1.25rem 0', color: '#64748B', fontSize: '0.875rem' }}>
                  Encuentra el lugar perfecto en Arequipa y resérvalo directamente para vincular tu presupuesto.
                </p>
                <button
                  onClick={() => navigate('/venues')}
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  + Reservar un Local Ahora
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
                {venueReservations.map((res) => (
                  <div key={res.reservationId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    background: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <img
                      src={res.imageUrl || "https://cache.marriott.com/content/dam/marriott-renditions/LIMWI/limwi-ballroom-dance-floor-9195-hor-clsc.jpg"}
                      alt={res.venueName}
                      style={{ width: '90px', height: '70px', borderRadius: '0.5rem', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>{res.venueName}</h4>
                        <span style={{ fontSize: '0.75rem', background: '#ECFDF5', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', fontWeight: '700' }}>
                          ✓ Reservado
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#64748B' }}>
                        📍 {res.district} ({res.address})
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#4F46E5', fontWeight: '600' }}>
                        📅 Del {res.startDate} al {res.endDate}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1E293B' }}>
                        S/ {res.totalPrice.toLocaleString('es-PE')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        👥 Aforo max: {res.maxCapacity}
                      </span>
                      <button
                        onClick={() => navigate(`/venues/${res.venueId}`)}
                        style={{ background: 'none', border: 'none', color: '#6366F1', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', padding: 0, marginTop: '0.25rem' }}
                      >
                        Ver local →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid-right">
          {/* Próximas Tareas (Database Driven & Direct Route) */}
          <div className="dash-card">
            <h2 className="dash-card__title">
              Próximas Tareas
              <button
                className="dash-card__link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => navigate('/chronogram')}
              >
                Ver todas ({tasks.length}) →
              </button>
            </h2>
            <div className="task-list">
              {upcomingTasks.length === 0 ? (
                <p style={{ color: '#94A3B8', fontStyle: 'italic', padding: '1rem' }}>No hay tareas registradas para este evento.</p>
              ) : (
                upcomingTasks.slice(0, 5).map((task, index) => {
                  const completed = task.status.toUpperCase() === "COMPLETED" || task.status.toUpperCase() === "COMPLETADA";

                  const priorityClass =
                    task.priority === "HIGH"
                      ? "priority-high"
                      : task.priority === "LOW"
                        ? "priority-low"
                        : "priority-medium";

                  const priorityLabel =
                    completed
                      ? "Completada"
                      : task.priority === "HIGH"
                        ? "Alta prioridad"
                        : task.priority === "LOW"
                          ? "Baja prioridad"
                          : "Media prioridad";

                  return (
                    <div key={task.id}>
                      <div className="task-item">
                        <input
                          type="checkbox"
                          className="task-checkbox"
                          checked={completed}
                          readOnly
                        />

                        <div className="task-content">
                          <div
                            className="task-title"
                            style={
                              completed
                                ? { textDecoration: "line-through", color: "#94A3B8" }
                                : undefined
                            }
                          >
                            {task.title}
                          </div>

                          <div className={`task-priority ${priorityClass}`}>
                            {priorityLabel}
                          </div>
                        </div>

                        <div className="task-date">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "short",
                          }) : 'Sin fecha'}
                        </div>
                      </div>
                      {index < Math.min(upcomingTasks.length, 5) - 1 && (
                        <hr
                          style={{
                            borderTop: "1px solid #F1F5F9",
                            margin: "0",
                          }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Presupuesto y Reservas (Dynamic formatting & Overbudget warning) */}
          <div className="dash-card">
            <h2 className="dash-card__title">Presupuesto y Reservas (Soles)</h2>
            <div className="budget-gauge-container">
              <div className="gauge-chart">
                <div className="gauge-inner">
                  <span className="gauge-amount" style={{ color: isOverBudget ? '#EF4444' : '#1E293B' }}>
                    S/ {selectedEvent.budgetUsed.toLocaleString('es-PE')}
                  </span>
                  <span className="gauge-total">de S/ {selectedEvent.budget.toLocaleString('es-PE')}</span>
                </div>
              </div>
              <div className="budget-legend chart-legend">
                <div className="legend-item">
                  <div className="legend-label">
                    <span className="dot dot--blue"></span> Gastado en Reservas
                  </div>
                  <span className="legend-value">S/ {selectedEvent.budgetUsed.toLocaleString('es-PE')}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-label">
                    <span className="dot" style={{ background: isOverBudget ? '#EF4444' : '#10B981' }}></span>
                    {isOverBudget ? 'Exceso' : 'Saldo Restante'}
                  </div>
                  <span className="legend-value" style={{ color: isOverBudget ? '#EF4444' : '#10B981', fontWeight: '700' }}>
                    S/ {Math.abs(budgetBalance).toLocaleString('es-PE')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Eventos de tu Cuenta */}
          <div className="dash-card">
            <h2 className="dash-card__title">
              Tus Eventos Registrados
              <Link to="/events/new" className="dash-card__link">+ Nuevo evento</Link>
            </h2>
            <div className="event-list">
              {events.map((evt, index) => {
                const evtDate = new Date(evt.date);
                const month = evtDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                const day = evtDate.getDate();

                return (
                  <div key={evt.id}>
                    <div
                      className="event-item"
                      onClick={() => setSelectedEvent(evt)}
                      style={{ cursor: 'pointer', background: evt.id === selectedEvent.id ? '#F5F3FF' : 'transparent', padding: '0.75rem', borderRadius: '0.5rem' }}
                    >
                      <div className="event-date-badge">
                        <div className="event-month">{month}</div>
                        <div className="event-day">{day}</div>
                      </div>
                      <div className="event-item-info">
                        <div className="event-item-title" style={{ fontWeight: evt.id === selectedEvent.id ? '700' : '500' }}>
                          🎉 {evt.name}
                        </div>
                        <div className="event-item-meta">
                          <span>Categoría: {evt.type}</span>
                          <span>📍 {evt.location || 'Arequipa'}</span>
                        </div>
                      </div>
                      <div className="event-chevron">{evt.id === selectedEvent.id ? '✓' : '›'}</div>
                    </div>
                    {index < events.length - 1 && <hr style={{ borderTop: '1px solid #F1F5F9', margin: '0' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="ai-suggestion">
        <div className="ai-suggestion-text">
          <span className="ai-icon">✨</span>
          <span>La IA detectó sugerencias inteligentes para optimizar la planificación de <strong>{selectedEvent.name}</strong>.</span>
        </div>
        <div className="ai-actions">
          <button className="btn-outline-purple" onClick={() => navigate('/chronogram')}>Ver cronograma inteligente →</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
