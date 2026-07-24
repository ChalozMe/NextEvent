import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService, type EventTask } from '../services/eventService';
import type { NexEvent } from '../types';
import './ChronogramPage.css';

const PHASE_LABELS: Record<string, { label: string; number: string; unit: string }> = {
  '6_meses_antes': { label: '🎯 6 Meses Antes del Evento', number: '6M', unit: 'Antes' },
  '3_meses_antes': { label: '🎯 3 Meses Antes del Evento', number: '3M', unit: 'Antes' },
  '1_mes_antes': { label: '🎯 1 Mes Antes del Evento', number: '1M', unit: 'Antes' },
  '1_semana_antes': { label: '🎯 1 Semana Antes del Evento', number: '1W', unit: 'Antes' },
  'dia_evento': { label: '🎉 Día del Evento', number: 'HOY', unit: 'Evento' }
};

const ChronogramPage = () => {
  const [events, setEvents] = useState<NexEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NexEvent | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection state (circle checkboxes only select/unselect)
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

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
    setSelectedTaskIds([]);
    fetchEventTasks(selectedEventId);
  }, [selectedEventId, events]);

  // Circle toggle selection (only selects/deselects task row)
  const toggleTaskSelection = (taskId: number) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // ONLY status pill gear button changes task status
  const handleStatusChange = async (taskId: number, currentStatus: string) => {
    let nextStatus = 'PENDING';
    const s = currentStatus.toUpperCase();
    if (s === 'PENDING' || s === 'PENDIENTE') nextStatus = 'IN_PROGRESS';
    else if (s === 'IN_PROGRESS' || s === 'PROGRESO') nextStatus = 'COMPLETED';
    else nextStatus = 'PENDING';

    try {
      const updated = await eventService.updateTaskStatus(taskId, nextStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      alert("No se pudo actualizar el estado de la tarea.");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: number, taskTitle: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la tarea "${taskTitle}"?`)) return;

    try {
      await eventService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      alert("No se pudo eliminar la tarea.");
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
    if (s === 'COMPLETED' || s === 'COMPLETADA') return { label: 'Completada', class: 'completada', icon: '✅' };
    if (s === 'IN_PROGRESS' || s === 'PROGRESO') return { label: 'En progreso', class: 'progreso', icon: '⚡' };
    return { label: 'Pendiente', class: 'pendiente', icon: '🕒' };
  };

  const getPriorityBadge = (priority?: string) => {
    const p = (priority || 'MEDIUM').toUpperCase();
    if (p === 'HIGH' || p === 'ALTA') return <span className="priority-badge high">Prioridad Alta</span>;
    if (p === 'LOW' || p === 'BAJA') return <span className="priority-badge low">Prioridad Baja</span>;
    return <span className="priority-badge medium">Prioridad Media</span>;
  };

  const completedCount = tasks.filter(t => t.status.toUpperCase() === 'COMPLETED' || t.status.toUpperCase() === 'COMPLETADA').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="chronogram-container">
      {/* Header Row */}
      <div className="chrono-header-top">
        <Link to="/" className="back-link">
          ← Volver a mi Dashboard
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="chrono-hero-card">
        <div className="chrono-hero-main">
          <div className="chrono-hero-header">
            <span className="chrono-ai-badge">✨ Cronograma Inteligente IA</span>
            <div className="event-switcher-wrapper">
              <span className="event-switcher-icon">🎉</span>
              <select
                className="event-switcher-select"
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({evt.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h1 className="chrono-hero-title">{selectedEvent?.name || 'Cronograma de Evento'}</h1>
          <p className="chrono-hero-subtitle">
            📍 {selectedEvent?.location || 'Arequipa'} &nbsp;•&nbsp; 🏷️ Categoría: <strong style={{ textTransform: 'capitalize' }}>{selectedEvent?.type || 'Social'}</strong>
          </p>

          {/* Progress Bar */}
          <div className="chrono-progress-section">
            <div className="chrono-progress-header">
              <span>Progreso del evento</span>
              <span className="chrono-progress-percent">{progressPercent}% completado ({completedCount}/{tasks.length} tareas)</span>
            </div>
            <div className="chrono-progress-bar-bg">
              <div className="chrono-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="chrono-hero-stats">
          <div className="hero-stat-box">
            <span className="hero-stat-icon">📅</span>
            <div className="hero-stat-info">
              <span className="hero-stat-label">Fecha del evento</span>
              <span className="hero-stat-value">
                {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No definida'}
              </span>
            </div>
          </div>

          <div className="hero-stat-box accent">
            <span className="hero-stat-icon">⏳</span>
            <div className="hero-stat-info">
              <span className="hero-stat-label">Días restantes</span>
              <span className="hero-stat-value highlight">{calculateDaysRemaining(selectedEvent?.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Pills & New Task Button */}
      <div className="chrono-filters">
        <div className="filter-group">
          <button 
            className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Todas ({tasks.length})
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

          {/* Prominent New Task Button */}
          <button className="btn-new-task" onClick={() => setShowModal(true)}>
            <span>+</span> Nueva tarea
          </button>
        </div>
        {selectedTaskIds.length > 0 && (
          <span className="selected-tasks-count">
            {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'tarea seleccionada' : 'tareas seleccionadas'}
          </span>
        )}
      </div>

      {/* Timeline Sections */}
      {loading ? (
        <p style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Cargando cronograma del evento...</p>
      ) : (
        <div className="timeline-wrapper">
          <div className="timeline-container">
            {phases.map(phaseKey => {
              const phaseInfo = PHASE_LABELS[phaseKey];
              const phaseTasks = groupedTasks[phaseKey] || [];

              if (phaseTasks.length === 0 && statusFilter !== 'ALL') return null;

              return (
                <div key={phaseKey} className="timeline-section">
                  {/* Clean Milestone Marker */}
                  <div className="milestone-marker">
                    <span className="marker-number">{phaseInfo.number}</span>
                    <span className="marker-unit">{phaseInfo.unit}</span>
                  </div>

                  <div className="timeline-circle"></div>
                  
                  <div className="milestone-header">
                    <div className="milestone-title">{phaseInfo.label}</div>
                    <div className="milestone-date">{phaseTasks.length} tareas</div>
                  </div>

                  <div className="task-list-wrapper">
                    {phaseTasks.length === 0 ? (
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem' }}>
                        No hay tareas en esta fase. Haz clic en "+ Nueva tarea" para añadir una.
                      </p>
                    ) : (
                      phaseTasks.map(task => {
                        const statusObj = getStatusLabel(task.status);
                        const isSelected = selectedTaskIds.includes(task.id);
                        return (
                          <div key={task.id} className={`timeline-task ${isSelected ? 'selected-row' : ''}`}>
                            {/* Circle Checkbox ONLY selects/deselects row */}
                            <div 
                              className={`task-checkbox-circle ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleTaskSelection(task.id)}
                              title="Seleccionar tarea"
                            >
                              {isSelected && '✓'}
                            </div>

                            <div className="task-body">
                              <div className="task-title-row">
                                <span className="task-name">{task.title}</span>
                                {getPriorityBadge(task.priority)}
                              </div>
                              {task.description && (
                                <p className="task-description-text">{task.description}</p>
                              )}
                            </div>

                            <div className="task-assignee">👤 {task.assignedTo || 'Organizador'}</div>
                            <div className="task-date-info">
                              📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'}
                            </div>

                            {/* ONLY Status Pill changes status */}
                            <div className="task-status-container">
                              <span 
                                className={`status-pill ${statusObj.class}`}
                                onClick={() => handleStatusChange(task.id, task.status)}
                                title="Clic para alternar estado (Pendiente -> En progreso -> Completada)"
                              >
                                {statusObj.icon} {statusObj.label} ⚙️
                              </span>
                            </div>

                            {/* Delete Task Button */}
                            <button
                              className="btn-delete-task"
                              onClick={() => handleDeleteTask(task.id, task.title)}
                              title="Eliminar tarea"
                            >
                              🗑️
                            </button>
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
