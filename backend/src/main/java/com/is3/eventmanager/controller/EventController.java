package com.is3.eventmanager.controller;

import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.dto.EventVenueReservationDTO;
import com.is3.eventmanager.dto.JoinEventRequest;
import com.is3.eventmanager.dto.TaskRequest;
import com.is3.eventmanager.dto.UpdateTaskStatusRequest;

import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.UserEvent;
import com.is3.eventmanager.entity.Task;

import com.is3.eventmanager.service.EventService;
import com.is3.eventmanager.service.VenueReservationService;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final VenueReservationService reservationService;

    public EventController(EventService eventService, VenueReservationService reservationService) {
        this.eventService = eventService;
        this.reservationService = reservationService;
    }

    @PostMapping
    public String createEvent(
            @RequestBody EventRequest request,
            Authentication authentication) {

        eventService.create(request, authentication.getName());
        return "Event created";
    }

    @GetMapping
    public List<Event> getEvents(Authentication authentication) {
        return eventService.getEventsByUser(authentication.getName());
    }

    @PostMapping("/{eventId}/join")
    public String joinEvent(
            @PathVariable Long eventId,
            @RequestBody JoinEventRequest request) {

        eventService.joinEvent(eventId, request.getUserId());
        return "User registered";
    }

    @GetMapping("/{eventId}/participants")
    public List<UserEvent> getParticipants(@PathVariable Long eventId) {
        return eventService.getParticipants(eventId);
    }

    @GetMapping("/{eventId}/tasks")
    public List<Task> getTasks(@PathVariable Long eventId) {
        return eventService.getTasks(eventId);
    }

    @GetMapping("/{eventId}/reservations")
    public List<EventVenueReservationDTO> getEventReservations(@PathVariable Long eventId) {
        return reservationService.getReservationsByEvent(eventId);
    }
    
    @PostMapping("/{eventId}/tasks")
    public Task createTask(@PathVariable Long eventId, @RequestBody TaskRequest request) {
      return eventService.createTask(eventId, request);
    }

    @PatchMapping("/{eventId}/tasks/{taskId}/status")
    public Task updateTaskStatus(
    @PathVariable Long eventId,
    @PathVariable Long taskId,
    @RequestBody UpdateTaskStatusRequest request
    ) {
      return eventService.updateTaskStatus(
        eventId,
        taskId,
        request.getStatus()
      );
    }

}
