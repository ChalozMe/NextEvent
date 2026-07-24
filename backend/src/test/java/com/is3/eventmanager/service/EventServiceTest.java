package com.is3.eventmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.is3.eventmanager.dto.EventRequest;
import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.Task;
import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.entity.UserEvent;
import com.is3.eventmanager.repository.EventRepository;
import com.is3.eventmanager.repository.TaskRepository;
import com.is3.eventmanager.repository.UserEventRepository;
import com.is3.eventmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserEventRepository userEventRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskTemplateService taskTemplateService;

    private EventService eventService;

    @BeforeEach
    void setUp() {
        eventService = new EventService(
            eventRepository,
            userRepository,
            userEventRepository,
            taskRepository,
            taskTemplateService
        );
    }

    @Test
    void create_ShouldCreateEventAndGenerateTasks_WhenUserExists() {
        // Arrange
        String email = "john@email.com";
        EventRequest request = new EventRequest();
        request.setName("Boda Real");
        request.setType("Boda");
        request.setEventDate(LocalDateTime.of(2027, 10, 20, 18, 0));
        request.setCapacity(150);
        request.setLocation("Jardín Principal");
        request.setDescription("Descripción de boda");
        request.setStatus("Planificado");
        request.setBudget(new BigDecimal("15000.00"));

        User user = new User();
        user.setEmail(email);

        Event savedEvent = new Event();
        setId(savedEvent, 1L);
        savedEvent.setName("Boda Real");

        Task dummyTask = new Task();
        setId(dummyTask, 10L);
        dummyTask.setTitle("Tarea de prueba");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);
        when(taskTemplateService.generate(any(Event.class))).thenReturn(List.of(dummyTask));

        // Act
        eventService.create(request, email);

        // Assert
        verify(eventRepository).save(any(Event.class));
        
        ArgumentCaptor<UserEvent> userEventCaptor = ArgumentCaptor.forClass(UserEvent.class);
        verify(userEventRepository).save(userEventCaptor.capture());
        
        UserEvent userEvent = userEventCaptor.getValue();
        assertEquals(user, userEvent.getUser());
        assertEquals(savedEvent, userEvent.getEvent());
        assertEquals("OWNER", userEvent.getRole());
        assertNotNull(userEvent.getJoinedAt());

        verify(taskRepository).save(dummyTask);
    }

    @Test
    void create_ShouldThrowException_WhenUserDoesNotExist() {
        // Arrange
        String email = "unknown@email.com";
        EventRequest request = new EventRequest();

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> eventService.create(request, email));
        verify(eventRepository, never()).save(any(Event.class));
        verify(userEventRepository, never()).save(any(UserEvent.class));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void joinEvent_ShouldRegisterAttendee_WhenEventAndUserExist() {
        // Arrange
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        setId(event, eventId);

        User user = new User();
        user.setId(userId);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        eventService.joinEvent(eventId, userId);

        // Assert
        ArgumentCaptor<UserEvent> userEventCaptor = ArgumentCaptor.forClass(UserEvent.class);
        verify(userEventRepository).save(userEventCaptor.capture());

        UserEvent userEvent = userEventCaptor.getValue();
        assertEquals(event, userEvent.getEvent());
        assertEquals(user, userEvent.getUser());
        assertEquals("ATTENDEE", userEvent.getRole());
        assertNotNull(userEvent.getJoinedAt());
    }

    @Test
    void joinEvent_ShouldThrowException_WhenEventDoesNotExist() {
        // Arrange
        Long eventId = 1L;
        Long userId = 2L;

        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> eventService.joinEvent(eventId, userId));
        verify(userRepository, never()).findById(anyLong());
        verify(userEventRepository, never()).save(any(UserEvent.class));
    }

    @Test
    void joinEvent_ShouldThrowException_WhenUserDoesNotExist() {
        // Arrange
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> eventService.joinEvent(eventId, userId));
        verify(userEventRepository, never()).save(any(UserEvent.class));
    }

    @Test
    void getParticipants_ShouldReturnListFromRepository() {
        // Arrange
        Long eventId = 1L;
        UserEvent userEvent = new UserEvent();
        List<UserEvent> expected = List.of(userEvent);

        when(userEventRepository.findByEventId(eventId)).thenReturn(expected);

        // Act
        List<UserEvent> actual = eventService.getParticipants(eventId);

        // Assert
        assertEquals(expected, actual);
        verify(userEventRepository).findByEventId(eventId);
    }

    @Test
    void getEventsByUser_ShouldReturnMappedEvents() {
        // Arrange
        String email = "john@email.com";
        Event event = new Event();
        setId(event, 1L);

        UserEvent userEvent = new UserEvent();
        userEvent.setEvent(event);

        when(userEventRepository.findByUserEmail(email)).thenReturn(List.of(userEvent));

        // Act
        List<Event> actual = eventService.getEventsByUser(email);

        // Assert
        assertEquals(1, actual.size());
        assertEquals(event, actual.get(0));
        verify(userEventRepository).findByUserEmail(email);
    }

    @Test
    void getTasks_ShouldReturnOrderedTasks() {
        // Arrange
        Long eventId = 1L;
        Task task = new Task();
        List<Task> expected = List.of(task);

        when(taskRepository.findByEventIdOrderByDueDateAsc(eventId)).thenReturn(expected);

        // Act
        List<Task> actual = eventService.getTasks(eventId);

        // Assert
        assertEquals(expected, actual);
        verify(taskRepository).findByEventIdOrderByDueDateAsc(eventId);
    }

    private void setId(Object entity, Long id) {
        try {
            java.lang.reflect.Field field = entity.getClass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
