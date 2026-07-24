package com.is3.eventmanager.service;

import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.Task;
import com.is3.eventmanager.repository.EventRepository;
import com.is3.eventmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EventRepository eventRepository;

    public TaskService(TaskRepository taskRepository, EventRepository eventRepository) {
        this.taskRepository = taskRepository;
        this.eventRepository = eventRepository;
    }

    public List<Task> getTasksByEvent(Long eventId) {
        return taskRepository.findByEventIdOrderByDueDateAsc(eventId);
    }

    public Task updateStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la tarea con ID: " + taskId));
        
        task.setStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status) || "completada".equalsIgnoreCase(status)) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        return taskRepository.save(task);
    }

    public Task createTaskForEvent(Long eventId, Task task) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el evento con ID: " + eventId));
        
        task.setEvent(event);
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDateTime.now());
        }
        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
        if (task.getPhase() == null) {
            task.setPhase("3_meses_antes");
        }

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
