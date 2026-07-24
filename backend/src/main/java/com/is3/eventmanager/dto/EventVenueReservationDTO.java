package com.is3.eventmanager.dto;

import java.math.BigDecimal;

public class EventVenueReservationDTO {
    private Long reservationId;
    private Long venueId;
    private String venueName;
    private String category;
    private String district;
    private String address;
    private String imageUrl;
    private Integer maxCapacity;
    private BigDecimal referencePrice;
    private BigDecimal totalPrice;
    private String startDate;
    private String endDate;
    private String status;

    public EventVenueReservationDTO() {
    }

    public EventVenueReservationDTO(
            Long reservationId,
            Long venueId,
            String venueName,
            String category,
            String district,
            String address,
            String imageUrl,
            Integer maxCapacity,
            BigDecimal referencePrice,
            BigDecimal totalPrice,
            String startDate,
            String endDate,
            String status
    ) {
        this.reservationId = reservationId;
        this.venueId = venueId;
        this.venueName = venueName;
        this.category = category;
        this.district = district;
        this.address = address;
        this.imageUrl = imageUrl;
        this.maxCapacity = maxCapacity;
        this.referencePrice = referencePrice;
        this.totalPrice = totalPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public Long getVenueId() {
        return venueId;
    }

    public String getVenueName() {
        return venueName;
    }

    public String getCategory() {
        return category;
    }

    public String getDistrict() {
        return district;
    }

    public String getAddress() {
        return address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public BigDecimal getReferencePrice() {
        return referencePrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public void setReferencePrice(BigDecimal referencePrice) {
        this.referencePrice = referencePrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
