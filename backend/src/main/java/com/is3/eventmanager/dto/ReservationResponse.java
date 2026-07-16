package com.is3.eventmanager.dto;

import java.util.List;

public class ReservationResponse {
    private String reservedDate; // YYYY-MM-DD
    private List<String> bufferBeforeDates; // 4 days before
    private List<String> bufferAfterDates;  // 4 days after
    private String status;

    public ReservationResponse() {
    }

    public ReservationResponse(String reservedDate, List<String> bufferBeforeDates, List<String> bufferAfterDates, String status) {
        this.reservedDate = reservedDate;
        this.bufferBeforeDates = bufferBeforeDates;
        this.bufferAfterDates = bufferAfterDates;
        this.status = status;
    }

    public String getReservedDate() {
        return reservedDate;
    }

    public List<String> getBufferBeforeDates() {
        return bufferBeforeDates;
    }

    public List<String> getBufferAfterDates() {
        return bufferAfterDates;
    }

    public String getStatus() {
        return status;
    }

    public void setReservedDate(String reservedDate) {
        this.reservedDate = reservedDate;
    }

    public void setBufferBeforeDates(List<String> bufferBeforeDates) {
        this.bufferBeforeDates = bufferBeforeDates;
    }

    public void setBufferAfterDates(List<String> bufferAfterDates) {
        this.bufferAfterDates = bufferAfterDates;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
