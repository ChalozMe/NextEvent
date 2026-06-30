package com.is3.eventmanager.repository;


import com.is3.eventmanager.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    
}

