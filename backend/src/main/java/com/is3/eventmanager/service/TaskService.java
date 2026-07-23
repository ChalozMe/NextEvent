package com.is3.eventmanager.service;

import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.Task;
import com.is3.eventmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasksByEvent(Long eventId) {
        return taskRepository.findByEventIdOrderByDueDateAsc(eventId);
    }

    public void create(Task task) {
        taskRepository.save(task);
    }

}
