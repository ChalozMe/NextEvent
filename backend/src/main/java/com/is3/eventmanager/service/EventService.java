package com.is3.eventmanager.service;


import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.entity.UserEvent;
import com.is3.eventmanager.repository.UserRepository;
import com.is3.eventmanager.repository.UserEventRepository;

import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.dto.TaskRequest;

import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.repository.EventRepository;

//task added
import com.is3.eventmanager.entity.Task;
import com.is3.eventmanager.service.TaskTemplateService;
import com.is3.eventmanager.repository.TaskRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;
import java.math.BigDecimal;


@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final UserEventRepository userEventRepository;

    private final TaskRepository taskRepository;
    private final TaskTemplateService taskTemplateService;

    public EventService(
        EventRepository eventRepository,
        UserRepository userRepository,
        UserEventRepository userEventRepository,
        TaskRepository taskRepository,
        TaskTemplateService taskTemplateService) {

      this.eventRepository = eventRepository;
      this.userRepository = userRepository;
      this.userEventRepository = userEventRepository;
      this.taskRepository = taskRepository;
      this.taskTemplateService = taskTemplateService;
    }

    public void create(EventRequest request, String email) {

      User user = userRepository.findByEmail(email).orElseThrow();

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

      event = eventRepository.save(event);

      UserEvent userEvent = new UserEvent();
      userEvent.setUser(user);
      userEvent.setEvent(event);
      userEvent.setRole("OWNER");
      userEvent.setJoinedAt(LocalDateTime.now());

      userEventRepository.save(userEvent);

      for (Task task : taskTemplateService.generate(event)) {
        taskRepository.save(task);
      }
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

    public List<Task> getTasks(Long eventId) {
     return taskRepository.findByEventIdOrderByDueDateAsc(eventId);
    }

    public Task createTask(Long eventId, TaskRequest request) {

      Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

      Task task = new Task();

      task.setEvent(event);
      task.setTitle(request.getTitle());
      task.setDescription(request.getDescription());
      task.setDueDate(request.getDueDate().atStartOfDay());
      task.setPriority(request.getPriority());
      task.setPhase(request.getPhase());
      task.setAssignedTo(request.getAssignedTo());
      task.setStatus("PENDING");
      task.setCreatedAt(LocalDateTime.now());

      return taskRepository.save(task);
    }

}
