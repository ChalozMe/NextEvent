import { Link } from 'react-router-dom';
import './ChronogramPage.css';

const ChronogramPage = () => {
  return (
    <div className="chronogram-container">
      {/* Header Row */}
      <div className="chrono-header-top">
        <Link to="/" className="back-link">
          ← Volver a mi evento
        </Link>
        <div className="chrono-actions">
          <div className="action-icon">
            🔔
            <span className="notification-badge">3</span>
          </div>
          <button className="btn-new-task">
            <span>+</span> Nueva tarea
          </button>
        </div>
      </div>

      {/* Title Area */}
      <div className="chrono-title-area">
        <div>
          <h1 className="chrono-title">Cronograma generado por IA ✨</h1>
          <p className="chrono-subtitle">
            Este cronograma está basado en tu evento <span className="chrono-subtitle-highlight">Boda</span> el <span className="chrono-subtitle-highlight">20 de Julio de 2025</span>.
          </p>
        </div>
        <div className="chrono-event-info">
          <div className="chrono-info-block">
            <span className="chrono-info-label">Fecha del evento</span>
            <span className="chrono-info-value">📅 20 de Julio, 2025</span>
          </div>
          <div className="chrono-info-block">
            <span className="chrono-info-label">Días restantes</span>
            <span className="chrono-info-value blue-text">45 días</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="chrono-filters">
        <div className="filter-group">
          <button className="filter-btn active">
            Todas las tareas
          </button>
          <button className="filter-btn">
            <span className="status-dot grey"></span> Pendientes
          </button>
          <button className="filter-btn">
            <span className="status-dot blue"></span> En progreso
          </button>
          <button className="filter-btn">
            <span className="status-dot green"></span> Completadas
          </button>
        </div>
        <button className="btn-calendar-view">
          📅 Ver por calendario
        </button>
      </div>

      {/* Timeline */}
      <div style={{ marginLeft: '2rem' }}>
        <div className="timeline-container">
          
          {/* Milestone 1 */}
          <div className="timeline-section">
            <div className="milestone-marker">
              6
              <span>meses antes</span>
            </div>
            <div className="timeline-circle"></div>
            
            <div className="milestone-header">
              <div className="milestone-title">🎯 6 meses antes del evento</div>
              <div className="milestone-date">20 de Enero, 2025</div>
            </div>

            <div className="task-list-wrapper">
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Definir presupuesto y número de invitados</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 20 Ene, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill completada">Completada</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Reservar el lugar del evento</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 25 Ene, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill progreso">En progreso</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Contratar wedding planner (opcional)</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 31 Ene, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="timeline-section">
            <div className="milestone-marker">
              3
              <span>meses antes</span>
            </div>
            <div className="timeline-circle"></div>
            
            <div className="milestone-header">
              <div className="milestone-title">🎯 3 meses antes del evento</div>
              <div className="milestone-date">20 de Abril, 2025</div>
            </div>

            <div className="task-list-wrapper">
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Enviar save the date a invitados</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 20 Abr, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill completada">Completada</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Contratar catering</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 25 Abr, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill progreso">En progreso</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Elegir decoración y estilo del evento</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 30 Abr, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="timeline-section">
            <div className="milestone-marker">
              1
              <span>mes antes</span>
            </div>
            <div className="timeline-circle"></div>
            
            <div className="milestone-header">
              <div className="milestone-title">🎯 1 mes antes del evento</div>
              <div className="milestone-date">20 de Junio, 2025</div>
            </div>

            <div className="task-list-wrapper">
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Confirmar asistencia de invitados</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 20 Jun, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill progreso">En progreso</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Prueba de menú con catering</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 22 Jun, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Confirmar proveedores y servicios</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 28 Jun, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="timeline-section">
            <div className="milestone-marker">
              1
              <span>semana antes</span>
            </div>
            <div className="timeline-circle"></div>
            
            <div className="milestone-header">
              <div className="milestone-title">🎯 1 semana antes del evento</div>
              <div className="milestone-date">13 de Julio, 2025</div>
            </div>

            <div className="task-list-wrapper">
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Reunión final con todos los proveedores</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 13 Jul, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Preparar lista de reproducción y entretenimiento</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 15 Jul, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
              <div className="timeline-task">
                <div className="task-checkbox-circle"></div>
                <div className="task-name">Revisión final del cronograma del día</div>
                <div className="task-assignee">👤 María López</div>
                <div className="task-date-info">📅 19 Jul, 2025</div>
                <div className="task-status-container">
                  <span className="status-pill pendiente">Pendiente</span>
                </div>
                <div className="task-menu">⋮</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChronogramPage;
