package com.is3.eventmanager.controller;

import com.is3.eventmanager.entity.Task;
import com.is3.eventmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/event/{eventId}")
    public List<Task> getTasksByEvent(@PathVariable Long eventId) {
        return taskService.getTasksByEvent(eventId);
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Task> createTask(@PathVariable Long eventId, @RequestBody Task task) {
        Task created = taskService.createTaskForEvent(eventId, task);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        Task updated = taskService.updateStatus(taskId, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
