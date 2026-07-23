package com.is3.eventmanager.repository;

import com.is3.eventmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByEventIdOrderByDueDateAsc(Long eventId);

}
