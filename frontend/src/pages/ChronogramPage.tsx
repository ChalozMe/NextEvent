import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService, type EventTask } from '../services/eventService';
import type { NexEvent } from '../types';
import './ChronogramPage.css';

const PHASE_LABELS: Record<string, { label: string; number: string; unit: string }> = {
  '6_meses_antes': { label: '🎯 6 meses antes del evento', number: '6', unit: 'meses antes' },
  '3_meses_antes': { label: '🎯 3 meses antes del evento', number: '3', unit: 'meses antes' },
  '1_mes_antes': { label: '🎯 1 mes antes del evento', number: '1', unit: 'mes antes' },
  '1_semana_antes': { label: '🎯 1 semana antes del evento', number: '1', unit: 'semana antes' },
  'dia_evento': { label: '🎯 Día del evento', number: '0', unit: 'día del evento' }
};

const ChronogramPage = () => {
  const [events, setEvents] = useState<NexEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NexEvent | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Modal State for New Task
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('3_meses_antes');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getEvents();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
          setSelectedEvent(data[0]);
        }
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const fetchEventTasks = async (eventId: string) => {
    try {
      const data = await eventService.getTasks(eventId);
      setTasks(data);
    } catch (err) {
      console.error("Error al obtener tareas del evento:", err);
    }
  };

  useEffect(() => {
    if (!selectedEventId) return;
    const evt = events.find(e => e.id === selectedEventId) || null;
    setSelectedEvent(evt);
    fetchEventTasks(selectedEventId);
  }, [selectedEventId, events]);

  const handleStatusChange = async (taskId: number, currentStatus: string) => {
    // Cycle: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
    let nextStatus = 'PENDING';
    if (currentStatus === 'PENDING' || currentStatus === 'pendiente') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS' || currentStatus === 'progreso') nextStatus = 'COMPLETED';
    else nextStatus = 'PENDING';

    try {
      const updated = await eventService.updateTaskStatus(taskId, nextStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      alert("No se pudo actualizar el estado de la tarea.");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !newTaskTitle.trim()) return;

    setSavingTask(true);
    try {
      const created = await eventService.createTask(selectedEventId, {
        title: newTaskTitle,
        phase: newTaskPhase,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? `${newTaskDueDate}T12:00:00` : new Date().toISOString(),
        assignedTo: newTaskAssignedTo || 'Organizador',
        description: newTaskDesc,
        status: 'PENDING'
      });

      setTasks(prev => [...prev, created]);
      setShowModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskAssignedTo('');
    } catch (err) {
      console.error("Error al crear tarea:", err);
      alert("No se pudo crear la tarea.");
    } finally {
      setSavingTask(false);
    }
  };

  const calculateDaysRemaining = (eventDateStr?: string) => {
    if (!eventDateStr) return '0 días';
    const eventTime = new Date(eventDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} días` : 'Concluido';
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'ALL') return true;
    const s = t.status.toUpperCase();
    if (statusFilter === 'PENDING') return s === 'PENDING' || s === 'PENDIENTE';
    if (statusFilter === 'IN_PROGRESS') return s === 'IN_PROGRESS' || s === 'PROGRESO';
    if (statusFilter === 'COMPLETED') return s === 'COMPLETED' || s === 'COMPLETADA';
    return true;
  });

  const normalizePhase = (phaseStr?: string): string => {
    if (!phaseStr) return '3_meses_antes';
    const p = phaseStr.toLowerCase();
    if (p.includes('6_meses') || p.includes('180') || p.includes('150')) return '6_meses_antes';
    if (p.includes('3_meses') || p.includes('120') || p.includes('90')) return '3_meses_antes';
    if (p.includes('1_mes') || p.includes('60') || p.includes('30')) return '1_mes_antes';
    if (p.includes('1_semana') || p.includes('20') || p.includes('14') || p.includes('7')) return '1_semana_antes';
    if (p.includes('dia') || p.includes('2 d') || p.includes('0 d')) return 'dia_evento';
    return '3_meses_antes';
  };

  // Group tasks by phase
  const phases = ['6_meses_antes', '3_meses_antes', '1_mes_antes', '1_semana_antes', 'dia_evento'];
  const groupedTasks: Record<string, EventTask[]> = {};

  phases.forEach(p => { groupedTasks[p] = []; });
  filteredTasks.forEach(t => {
    const key = normalizePhase(t.phase);
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(t);
  });

  const getStatusLabel = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'COMPLETED' || s === 'COMPLETADA') return { label: 'Completada', class: 'completada' };
    if (s === 'IN_PROGRESS' || s === 'PROGRESO') return { label: 'En progreso', class: 'progreso' };
    return { label: 'Pendiente', class: 'pendiente' };
  };

  return (
    <div className="chronogram-container">
      {/* Header Row */}
      <div className="chrono-header-top">
        <Link to="/" className="back-link">
          ← Volver a mi evento
        </Link>
        <div className="chrono-actions">
          <button className="btn-new-task" onClick={() => setShowModal(true)}>
            <span>+</span> Nueva tarea
          </button>
        </div>
      </div>

      {/* Event Selector & Title Area */}
      <div className="chrono-title-area">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="chrono-title">Cronograma de Planificación ✨</h1>
            {/* Event Dropdown Switcher */}
            <select
              className="event-switcher-select"
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {events.map(evt => (
                <option key={evt.id} value={evt.id}>
                  🎉 {evt.name} ({evt.type})
                </option>
              ))}
            </select>
          </div>
          <p className="chrono-subtitle">
            Cronograma inteligente basado en tu evento <span className="chrono-subtitle-highlight">{selectedEvent?.name || 'Evento'}</span> en <span className="chrono-subtitle-highlight">{selectedEvent?.location || 'Arequipa'}</span>.
          </p>
        </div>

        <div className="chrono-event-info">
          <div className="chrono-info-block">
            <span className="chrono-info-label">Fecha del evento</span>
            <span className="chrono-info-value">📅 {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No definida'}</span>
          </div>
          <div className="chrono-info-block">
            <span className="chrono-info-label">Días restantes</span>
            <span className="chrono-info-value blue-text">{calculateDaysRemaining(selectedEvent?.date)}</span>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="chrono-filters">
        <div className="filter-group">
          <button 
            className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Todas las tareas ({tasks.length})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            <span className="status-dot grey"></span> Pendientes
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
            onClick={() => setStatusFilter('IN_PROGRESS')}
          >
            <span className="status-dot blue"></span> En progreso
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            <span className="status-dot green"></span> Completadas
          </button>
        </div>
      </div>

      {/* Timeline Sections */}
      {loading ? (
        <p style={{ padding: '3rem', textAlign: 'center' }}>Cargando cronograma del evento...</p>
      ) : (
        <div style={{ marginLeft: '2rem' }}>
          <div className="timeline-container">
            {phases.map(phaseKey => {
              const phaseInfo = PHASE_LABELS[phaseKey];
              const phaseTasks = groupedTasks[phaseKey] || [];

              if (phaseTasks.length === 0 && statusFilter !== 'ALL') return null;

              return (
                <div key={phaseKey} className="timeline-section">
                  <div className="milestone-marker">
                    {phaseInfo.number}
                    <span>{phaseInfo.unit}</span>
                  </div>
                  <div className="timeline-circle"></div>
                  
                  <div className="milestone-header">
                    <div className="milestone-title">{phaseInfo.label}</div>
                    <div className="milestone-date">{phaseTasks.length} tareas asociadas</div>
                  </div>

                  <div className="task-list-wrapper">
                    {phaseTasks.length === 0 ? (
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.5rem 1rem' }}>
                        No hay tareas en esta fase. Haz clic en "+ Nueva tarea" para añadir una.
                      </p>
                    ) : (
                      phaseTasks.map(task => {
                        const statusObj = getStatusLabel(task.status);
                        return (
                          <div key={task.id} className="timeline-task">
                            <div 
                              className={`task-checkbox-circle ${statusObj.class}`}
                              onClick={() => handleStatusChange(task.id, task.status)}
                              title="Haga clic para cambiar estado de la tarea"
                            >
                              {statusObj.class === 'completada' && '✓'}
                            </div>
                            <div className="task-name">{task.title}</div>
                            <div className="task-assignee">👤 {task.assignedTo || 'Organizador'}</div>
                            <div className="task-date-info">
                              📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'}
                            </div>
                            <div className="task-status-container">
                              <span 
                                className={`status-pill ${statusObj.class}`}
                                onClick={() => handleStatusChange(task.id, task.status)}
                                title="Clic para alternar (Pendiente -> En progreso -> Completada)"
                                style={{ cursor: 'pointer' }}
                              >
                                {statusObj.label} ⚙️
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for Creating New Task */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>✨ Agregar Nueva Tarea</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label>Título de la Tarea *</label>
                <input 
                  type="text" 
                  value={newTaskTitle} 
                  onChange={(e) => setNewTaskTitle(e.target.value)} 
                  placeholder="Ej. Contratar servicio de sonido e iluminación" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Fase del Cronograma *</label>
                <select value={newTaskPhase} onChange={(e) => setNewTaskPhase(e.target.value)}>
                  <option value="6_meses_antes">🎯 6 meses antes del evento</option>
                  <option value="3_meses_antes">🎯 3 meses antes del evento</option>
                  <option value="1_mes_antes">🎯 1 mes antes del evento</option>
                  <option value="1_semana_antes">🎯 1 semana antes del evento</option>
                  <option value="dia_evento">🎯 Día del evento</option>
                </select>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Prioridad</label>
                  <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha Límite</label>
                  <input 
                    type="date" 
                    value={newTaskDueDate} 
                    onChange={(e) => setNewTaskDueDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Asignado a</label>
                <input 
                  type="text" 
                  value={newTaskAssignedTo} 
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)} 
                  placeholder="Ej. María López / Fotógrafo" 
                />
              </div>

              <div className="form-group">
                <label>Descripción / Notas</label>
                <textarea 
                  rows={3} 
                  value={newTaskDesc} 
                  onChange={(e) => setNewTaskDesc(e.target.value)} 
                  placeholder="Detalles adicionales de la tarea..." 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={savingTask}>
                  {savingTask ? 'Guardando...' : 'Guardar Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronogramPage;
