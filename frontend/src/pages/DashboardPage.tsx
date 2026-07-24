import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventService, type EventTask } from "../services/eventService";
import type { NexEvent } from "../types";

const DashboardPage = () => {
  
  const navigate = useNavigate();

  const { user } = useAuth();

  const [events, setEvents] = useState<NexEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NexEvent | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(true);

  //calcs to data
  const budgetPercent = selectedEvent && selectedEvent.budget > 0
    ? Math.round((selectedEvent.budgetUsed / selectedEvent.budget) * 100)
    : 0;

  const daysRemaining = selectedEvent
    ? Math.max(
    0,
    Math.ceil(
      (new Date(selectedEvent.date).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  )
  : 0;

  const guestPercent =
    selectedEvent && selectedEvent.guestsTotal > 0
      ? Math.round(
        (selectedEvent.guestsConfirmed / selectedEvent.guestsTotal) * 100
      )
    : 0;

  const tasksCompleted = tasks.filter(
    t => t.status === "COMPLETED"
  ).length;

  const tasksTotal = tasks.length;

  const taskPercent =
    tasksTotal > 0
      ? Math.round((tasksCompleted / tasksTotal) * 100)
      : 0;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);

      if (data.length > 0) {
          setSelectedEvent(data[0]);
      }
      } catch (error) {
        console.error(error);
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
        console.error(err);
        setTasks([]);
      }
    };

    loadTasks();
  }, [selectedEvent]);

  if (loading) {
    return <p>Cargando eventos...</p>;
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
        <h2>Aún no tienes eventos</h2>

        <p>
          Crea tu primer evento para comenzar a planificar.
        </p>

        <button
        className="btn-new-event"
        onClick={() => navigate("/events/new")}
        >
        <span>+</span> Nuevo Evento
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
          <h1>¡Que gusto verte, {user?.fullName || 'María'}! 👋</h1>
          <p>Aquí tienes el resumen de tu evento.</p>
        </div>
        <div className="dashboard-header__actions">
          <div className="action-icon">🔍</div>

          <select
            value={selectedEvent?.id}
            onChange={(e) => {
              const event = events.find(ev => ev.id === e.target.value);
                if (event) setSelectedEvent(event);
            }}
          >
            {events.map(event => (
            <option key={event.id} value={event.id}>
            {event.name}
            </option>
            ))}
          </select>

        </div>
      </header>

      {/* KPI GRID */}
      <div className="kpi-grid">
        {/* Tareas Completadas */}
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

        {/* Invitados Confirmados */}
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
            <span>de {selectedEvent.guestsTotal} invitados</span>
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
          <div className="kpi-value">{daysRemaining}</div>
          <div className="kpi-footer">
            <span>para el evento</span>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill kpi-progress-fill--orange" style={{ width: `${Math.min(daysRemaining, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Presupuesto Utilizado */}
        <div className="kpi-card">
          <div className="kpi-card__header">
            <div className="kpi-card__title-group">
              <div className="kpi-icon kpi-icon--blue">💰</div>
              <span className="kpi-title">Presupuesto Utilizado</span>
            </div>
            <span className="kpi-more">•••</span>
          </div>
          <div className="kpi-value">${selectedEvent.budgetUsed.toLocaleString()}</div>
          <div className="kpi-footer">
            <span>de ${selectedEvent.budget.toLocaleString()}</span>
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill kpi-progress-fill--blue" style={{ width: `${budgetPercent}%` }}></div>
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
                  <span className="badge-planning">
                    {selectedEvent.status}
                  </span>
                  <div className="event-meta">
                    
                    <span>📅 {new Date(selectedEvent.date).toLocaleDateString()} </span>
                    <span>📍 {selectedEvent.location || "Sin ubicación"}</span>
                    <span>👥 {selectedEvent.capacity} invitados</span>
                  </div>
                </div>
              </div>

              <div className="event-chart">
                <div className="donut-chart">
                  <div className="donut-inner">68%</div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--green"></span>
                      Completadas
                    </div>
                    <span className="legend-value">34</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--blue"></span>
                      En progreso
                    </div>
                    <span className="legend-value">10</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <span className="dot dot--orange"></span>
                      Pendientes
                    </div>
                    <span className="legend-value">6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso de Tareas */}
          <div className="dash-card">
            <h2 className="dash-card__title">Progreso de Tareas</h2>
            <div className="line-chart-area">
              <div className="line-chart-labels-y">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              
              {/* Dummy line chart using SVG */}
              <svg className="line-chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                <polyline fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5" points="0,200 100,150 200,100 300,50 400,25 500,0" />
                
                <path d="M 0 200 Q 50 180 100 160 T 200 130 T 300 70 L 300 200 Z" fill="url(#gradient)" />
                <polyline fill="none" stroke="#6366F1" strokeWidth="2.5" points="0,200 50,180 100,160 150,135 200,130 250,110 300,70" />
                
                <circle cx="300" cy="70" r="4" fill="#6366F1" />
                <rect x="280" y="45" width="40" height="20" rx="10" fill="#6366F1" />
                <text x="300" y="58" fill="white" fontSize="10" textAnchor="middle">68%</text>

                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="line-chart-labels-x">
                <span>20 Abr</span>
                <span>27 Abr</span>
                <span>4 May</span>
                <span>11 May</span>
                <span>18 May</span>
                <span>25 May</span>
                <span>1 Jun</span>
                <span>8 Jun</span>
              </div>
            </div>
            <div className="line-chart-legend">
              <div className="line-legend-item">
                <div className="line-solid"></div>
                Progreso real
              </div>
              <div className="line-legend-item">
                <div className="line-dashed"></div>
                Progreso ideal
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid-right">
          {/* Próximas Tareas */}
          <div className="dash-card">
            <h2 className="dash-card__title">
              Próximas Tareas
              <a href="#" className="dash-card__link">Ver todas</a>
            </h2>
            <div className="task-list">
              {tasks.length === 0 ? (
              <p>No hay tareas registradas.</p>
              ) : (
              tasks.slice(0, 5).map((task, index) => {
              const completed = task.status === "COMPLETED";

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
                      ? {
                        textDecoration: "line-through",
                        color: "#94A3B8",
                        }
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
                  {new Date(task.dueDate).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                  })}
                </div>
              </div>
                  {index < Math.min(tasks.length, 5) - 1 && (
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

          {/* Presupuesto */}
          <div className="dash-card">
            <h2 className="dash-card__title">Presupuesto</h2>
            <div className="budget-gauge-container">
              <div className="gauge-chart">
                <div className="gauge-inner">
                  <span className="gauge-amount">${selectedEvent.budgetUsed.toLocaleString()}</span>
                  <span className="gauge-total">de ${selectedEvent.budget.toLocaleString()}</span>
                </div>
              </div>
              <div className="budget-legend chart-legend">
                <div className="legend-item">
                  <div className="legend-label">
                    <span className="dot dot--blue"></span> Gastado
                  </div>
                  <span className="legend-value">${selectedEvent.budgetUsed.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-label">
                    <span className="dot" style={{background: '#E2E8F0'}}></span> Restante
                  </div>
                  <span className="legend-value">${(selectedEvent.budget - selectedEvent.budgetUsed).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="dash-card">
            <h2 className="dash-card__title">
              Próximos Eventos
              <a href="#" className="dash-card__link">Ver calendario</a>
            </h2>
            <div className="event-list">
              <div className="event-item">
                <div className="event-date-badge">
                  <div className="event-month">MAY</div>
                  <div className="event-day">15</div>
                </div>
                <div className="event-item-info">
                  <div className="event-item-title">Prueba de menú</div>
                  <div className="event-item-meta">
                    <span>2:00 PM - 4:00 PM</span>
                    <span>📍 Hacienda Los Olivos</span>
                  </div>
                </div>
                <div className="event-chevron">›</div>
              </div>
              <hr style={{borderTop: '1px solid #F1F5F9', margin: '0'}}/>
              <div className="event-item">
                <div className="event-date-badge">
                  <div className="event-month">MAY</div>
                  <div className="event-day">20</div>
                </div>
                <div className="event-item-info">
                  <div className="event-item-title">Reunión con decorador</div>
                  <div className="event-item-meta">
                    <span>11:00 AM - 12:00 PM</span>
                    <span>📍 Oficina / Online</span>
                  </div>
                </div>
                <div className="event-chevron">›</div>
              </div>
              <hr style={{borderTop: '1px solid #F1F5F9', margin: '0'}}/>
              <div className="event-item">
                <div className="event-date-badge">
                  <div className="event-month">MAY</div>
                  <div className="event-day">25</div>
                </div>
                <div className="event-item-info">
                  <div className="event-item-title">Entrega final de invitados</div>
                  <div className="event-item-meta">
                    <span>Todo el día</span>
                    <span>-- --</span>
                  </div>
                </div>
                <div className="event-chevron">›</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="ai-suggestion">
        <div className="ai-suggestion-text">
          <span className="ai-icon">✨</span>
          <span>La IA detectó <strong>3 sugerencias</strong> para optimizar tu evento.</span>
        </div>
        <div className="ai-actions">
          <button className="btn-outline-purple">Ver sugerencias</button>
          <button className="btn-close">×</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
