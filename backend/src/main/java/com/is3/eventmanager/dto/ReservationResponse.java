package com.is3.eventmanager.dto;

import java.util.List;

public class ReservationResponse {
    private String startDate; // YYYY-MM-DD
    private String endDate;   // YYYY-MM-DD
    private List<String> reservedDates; // range YYYY-MM-DD
    private List<String> bufferBeforeDates; // 4 days before startDate
    private List<String> bufferAfterDates;  // 4 days after endDate
    private String status;

    public ReservationResponse() {
    }

    public ReservationResponse(String startDate, String endDate, List<String> reservedDates, List<String> bufferBeforeDates, List<String> bufferAfterDates, String status) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.reservedDates = reservedDates;
        this.bufferBeforeDates = bufferBeforeDates;
        this.bufferAfterDates = bufferAfterDates;
        this.status = status;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public List<String> getReservedDates() {
        return reservedDates;
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

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setReservedDates(List<String> reservedDates) {
        this.reservedDates = reservedDates;
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
