package com.is3.eventmanager.repository;

import com.is3.eventmanager.entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserEventRepository extends JpaRepository<UserEvent, Long> {
    List<UserEvent> findByEventId(Long eventId);
}
