package com.is3.eventmanager.service;


import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.entity.UserEvent;
import com.is3.eventmanager.repository.UserRepository;
import com.is3.eventmanager.repository.UserEventRepository;
import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final UserEventRepository userEventRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository, UserEventRepository userEventRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.userEventRepository = userEventRepository;
    }

    public void create(EventRequest request) {

        Event event = new Event();

        event.setType(request.getType());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());

        eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public void joinEvent(Long eventId, Long userId) {

      Event event = eventRepository.findById(eventId)
            .orElseThrow();

      User user = userRepository.findById(userId)
            .orElseThrow();

      UserEvent userEvent = new UserEvent();

      userEvent.setEvent(event);
      userEvent.setUser(user);
      userEvent.setRole("ATTENDEE");
      userEvent.setJoinedAt(LocalDateTime.now());

      userEventRepository.save(userEvent);
    }

    public List<UserEvent> getParticipants(Long eventId) {
      return userEventRepository.findByEventId(eventId);
    }

    public List<Event> getEventsByUser(String email) {
      List<UserEvent> userEvents = userEventRepository.findByUserEmail(email);
      return userEvents.stream()
        .map(UserEvent::getEvent)
        .toList();
    }
}
