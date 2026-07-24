import type { NexEvent, CreateEventRequest } from "../types";

const API_URL = "http://localhost:8080/api/events";

export interface EventTask {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  priority: string;
  phase: string;
  assignedTo: string | null;
  completedAt: string | null;
  createdAt: string;
}

export const eventService = {
  async createEvent(data: CreateEventRequest): Promise<void> {
    const token = localStorage.getItem("nexevent_token");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el evento");
    }
  },

  async getEvents(): Promise<NexEvent[]> {
    const token = localStorage.getItem("nexevent_token");

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los eventos");
    }

    const events = await response.json();

    return events.map((event: any) => ({
      id: event.id.toString(),

      name: event.name,
      type: event.type.toLowerCase(),

      date: event.eventDate,
      capacity: event.capacity,

      budget: Number(event.budget ?? 0),
      budgetUsed: Number(event.budgetUsed ?? 0),

      status: event.status,
      location: event.location,
      description: event.description,

      coverImage: event.coverImage,

      guestsConfirmed: 0,
      guestsTotal: event.capacity,

      tasksCompleted: 0,
      tasksTotal: 0,
    }));
  },

  async getTasks(eventId: string): Promise<EventTask[]> {
    const token = localStorage.getItem("nexevent_token");

    const response = await fetch(`http://localhost:8080/api/tasks/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener las tareas");
    }

    return response.json();
  },

  async updateTaskStatus(taskId: number, status: string): Promise<EventTask> {
    const token = localStorage.getItem("nexevent_token");
    const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el estado de la tarea");
    }

    return response.json();
  },

  async createTask(eventId: string, taskData: Partial<EventTask>): Promise<EventTask> {
    const token = localStorage.getItem("nexevent_token");
    const response = await fetch(`http://localhost:8080/api/tasks/event/${eventId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la tarea");
    }

    return response.json();
  },

  async deleteTask(taskId: number): Promise<void> {
    const token = localStorage.getItem("nexevent_token");
    const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la tarea");
    }
  },
};
