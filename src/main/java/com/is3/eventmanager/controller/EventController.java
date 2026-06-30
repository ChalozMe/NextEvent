package com.is3.eventmanager.controller;

import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public String createEvent(@RequestBody EventRequest request) {

        eventService.create(request);

        return "Event created";
    }

    @GetMapping
    public List<Event> getAllEvents() {
    return eventService.getAllEvents();
    }
}
