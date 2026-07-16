package com.is3.eventmanager.dto;

public class ReservationRequest {
    private String date; // YYYY-MM-DD
    private Long eventId;

    public ReservationRequest() {
    }

    public String getDate() {
        return date;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
