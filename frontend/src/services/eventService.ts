import type { NexEvent } from "../types";
import type { CreateEventRequest } from "../types";

const API_URL = "http://localhost:8080/api/events";

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
      name: event.type,
      type: event.type.toLowerCase(),
      date: event.eventDate,
      capacity: event.capacity,

      budget: 0,
      budgetUsed: 0,
      status: "activo",
      location: "LugarTest",
      description: "TestDescript",

      guestsConfirmed: 0,
      guestsTotal: event.capacity,

      tasksCompleted: 0,
      tasksTotal: 0
    }));
  },

};
