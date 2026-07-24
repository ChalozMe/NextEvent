import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  eventService,
  type EventTask,
} from "../services/eventService";
import type { NexEvent } from "../types";
import "./ChronogramPage.css";

type TaskFilter = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

const ChronogramPage = () => {
  const [event, setEvent] = useState<NexEvent | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChronogram = async () => {
      try {
        const eventId = localStorage.getItem("selected_event");

        if (!eventId) {
          return;
        }

        const [eventsData, tasksData] = await Promise.all([
          eventService.getEvents(),
          eventService.getTasks(eventId),
        ]);

        const selectedEvent =
          eventsData.find((item) => item.id === eventId) ?? null;

        setEvent(selectedEvent);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error al cargar el cronograma:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChronogram();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") {
      return tasks;
    }

    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce<Record<string, EventTask[]>>(
      (groups, task) => {
        const phase = task.phase || "Sin fase";

        if (!groups[phase]) {
          groups[phase] = [];
        }

        groups[phase].push(task);
        return groups;
      },
      {},
    );
  }, [filteredTasks]);

  const daysRemaining = event
    ? Math.max(
        0,
        Math.ceil(
          (new Date(event.date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatShortDate = (date: string) =>
    new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completada",
          className: "completada",
        };

      case "IN_PROGRESS":
        return {
          label: "En progreso",
          className: "progreso",
        };

      default:
        return {
          label: "Pendiente",
          className: "pendiente",
        };
    }
  };

  const handleCreateTask = async () => {
    const eventId = localStorage.getItem("selected_event");

    if (!eventId) {
      alert("No hay un evento seleccionado.");
      return;
    }

    const title = prompt("Título de la tarea:");

    if (!title?.trim()) {
      return;
    }

    const description = prompt("Descripción de la tarea:") ?? "";

    const dueDate = prompt(
      "Fecha límite en formato YYYY-MM-DD:",
    );

    if (!dueDate) {
      return;
    }

    const priority =
      prompt("Prioridad: HIGH, MEDIUM o LOW:", "MEDIUM") ??
      "MEDIUM";

    const phase =
      prompt("Fase, por ejemplo: 1 mes antes:", "1 mes antes") ??
      "Sin fase";

    const assignedTo =
      prompt("Responsable:", "Sin asignar") ?? "Sin asignar";

    try {
      const newTask = await eventService.createTask(eventId, {
        title: title.trim(),
        description,
        dueDate,
        priority: priority.toUpperCase(),
        phase,
        assignedTo,
      });

      setTasks((currentTasks) =>
        [...currentTasks, newTask].sort(
          (firstTask, secondTask) =>
            new Date(firstTask.dueDate).getTime() -
            new Date(secondTask.dueDate).getTime(),
        ),
      );

      } catch (error: any) {
        console.error("Error completo:", error);
        console.error("Respuesta:", error.response?.data);
        console.error("Estado HTTP:", error.response?.status);
        console.error("URL:", error.config?.url);

        const message =
          typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
          error.message ||
          "Error desconocido";

        alert(
          `No se pudo crear la tarea.\n` +
          `Estado: ${error.response?.status ?? "sin respuesta"}\n` +
          `Error: ${message}`,
      );
    }
  };

  const handleStatusChange = async (
    taskId: number,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  ) => {
    const eventId = localStorage.getItem("selected_event");

    if (!eventId) return;

    try {
      const updatedTask = await eventService.updateTaskStatus(
        eventId,
        taskId,
        status,
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el estado.");
    }
  };


  if (loading) {
    return <p>Cargando cronograma...</p>;
  }

  if (!event) {
    return (
      <div className="chronogram-container">
        <Link to="/" className="back-link">
          ← Volver a mi evento
        </Link>

        <p>No se encontró un evento seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="chronogram-container">
      <div className="chrono-header-top">
        <Link to="/" className="back-link">
          ← Volver a mi evento
        </Link>

        <div className="chrono-actions">
          <div className="action-icon">
            🔔
            <span className="notification-badge">3</span>
          </div>

          <button
            className="btn-new-task"
            onClick={handleCreateTask}
          >
            <span>+</span> Nueva tarea
          </button>
        </div>
      </div>

      <div className="chrono-title-area">
        <div>
          <h1 className="chrono-title">
            Cronograma generado automáticamente ✨
          </h1>

          <p className="chrono-subtitle">
            Este cronograma está basado en tu evento{" "}
            <span className="chrono-subtitle-highlight">
              {event.name}
            </span>{" "}
            el{" "}
            <span className="chrono-subtitle-highlight">
              {formatDate(event.date)}
            </span>
            .
          </p>
        </div>

        <div className="chrono-event-info">
          <div className="chrono-info-block">
            <span className="chrono-info-label">
              Fecha del evento
            </span>

            <span className="chrono-info-value">
              📅 {formatDate(event.date)}
            </span>
          </div>

          <div className="chrono-info-block">
            <span className="chrono-info-label">
              Días restantes
            </span>

            <span className="chrono-info-value blue-text">
              {daysRemaining} días
            </span>
          </div>
        </div>
      </div>

      <div className="chrono-filters">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            Todas las tareas
          </button>

          <button
            className={`filter-btn ${
              filter === "PENDING" ? "active" : ""
            }`}
            onClick={() => setFilter("PENDING")}
          >
            <span className="status-dot grey"></span>
            Pendientes
          </button>

          <button
            className={`filter-btn ${
              filter === "IN_PROGRESS" ? "active" : ""
            }`}
            onClick={() => setFilter("IN_PROGRESS")}
          >
            <span className="status-dot blue"></span>
            En progreso
          </button>

          <button
            className={`filter-btn ${
              filter === "COMPLETED" ? "active" : ""
            }`}
            onClick={() => setFilter("COMPLETED")}
          >
            <span className="status-dot green"></span>
            Completadas
          </button>
        </div>

        <button className="btn-calendar-view">
          📅 Ver por calendario
        </button>
      </div>

      <div style={{ marginLeft: "2rem" }}>
        <div className="timeline-container">
          {Object.entries(groupedTasks).length === 0 ? (
            <p>No hay tareas para este filtro.</p>
          ) : (
            Object.entries(groupedTasks).map(
              ([phase, phaseTasks]) => {
                const firstTask = phaseTasks[0];

                return (
                  <div className="timeline-section" key={phase}>
                    <div className="milestone-marker">
                      {phase.split(" ")[0]}
                      <span>
                        {phase
                          .split(" ")
                          .slice(1)
                          .join(" ")}
                      </span>
                    </div>

                    <div className="timeline-circle"></div>

                    <div className="milestone-header">
                      <div className="milestone-title">
                        🎯 {phase} del evento
                      </div>

                      <div className="milestone-date">
                        {formatDate(firstTask.dueDate)}
                      </div>
                    </div>

                    <div className="task-list-wrapper">
                      {phaseTasks.map((task) => {
                        const status = getStatusInfo(task.status);

                        return (
                          <div
                            className="timeline-task"
                            key={task.id}
                          >
                            <div className="task-checkbox-circle"></div>

                            <div className="task-name">
                              {task.title}
                            </div>

                            <div className="task-assignee">
                              👤 {task.assignedTo || "Sin asignar"}
                            </div>

                            <div className="task-date-info">
                              📅 {formatShortDate(task.dueDate)}
                            </div>

                              <div className="task-status-container">
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      task.id,
                                      e.target.value as
                                        | "PENDING"
                                        | "IN_PROGRESS"
                                        | "COMPLETED",
                                    )
                                  }
                                >
                                <option value="PENDING">
                                  Pendiente
                                </option>

                                <option value="IN_PROGRESS">
                                  En progreso
                                </option>

                                <option value="COMPLETED">
                                  Completada
                                </option>
                              </select>
                            </div>

                            <div className="task-menu">⋮</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChronogramPage;
