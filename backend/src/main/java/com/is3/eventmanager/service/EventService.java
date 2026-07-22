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
import java.math.BigDecimal;


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

    public void create(EventRequest request, String email) {
      Event event = new Event();

      event.setName(request.getName());
      event.setType(request.getType());
      event.setEventDate(request.getEventDate());
      event.setCapacity(request.getCapacity());

      event.setLocation(request.getLocation());
      event.setDescription(request.getDescription());

      event.setStatus(request.getStatus());

      event.setBudget(request.getBudget());
      event.setBudgetUsed(BigDecimal.ZERO);

      event.setCoverImage(null);

      eventRepository.save(event);
      
      User user = userRepository.findByEmail(email)
        .orElseThrow();

      UserEvent userEvent = new UserEvent();
      userEvent.setUser(user);
      userEvent.setEvent(event);
      userEvent.setRole("OWNER");
      userEvent.setJoinedAt(LocalDateTime.now());

      userEventRepository.save(userEvent);
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
