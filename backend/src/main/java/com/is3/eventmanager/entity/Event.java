package com.is3.eventmanager.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    private Integer capacity;

    public Event() {
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}
