package com.is3.eventmanager.dto;

public class ReservationRequest {
    private String startDate; // YYYY-MM-DD
    private String endDate;   // YYYY-MM-DD (optional, defaults to startDate)
    private Long eventId;

    public ReservationRequest() {
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate != null && !endDate.trim().isEmpty() ? endDate : startDate;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
