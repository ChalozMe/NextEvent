package com.is3.eventmanager.service;

import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.repository.EventRepository;
import org.springframework.stereotype.Service;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public void create(EventRequest request) {

        Event event = new Event();

        event.setType(request.getType());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());

        eventRepository.save(event);
    }

}
