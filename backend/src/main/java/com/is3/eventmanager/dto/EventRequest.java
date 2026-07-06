package com.is3.eventmanager.dto;

import java.time.LocalDateTime;

public class EventRequest {

    private String type;
    private LocalDateTime eventDate;
    private Integer capacity;

    public EventRequest() {
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
