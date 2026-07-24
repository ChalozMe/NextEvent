package com.is3.eventmanager.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private Integer capacity;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;

    private BigDecimal budget;

    @Column(name = "budget_used")
    private BigDecimal budgetUsed;

    @Column(name = "cover_image", columnDefinition = "TEXT")
    private String coverImage;

    public Event() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public BigDecimal getBudgetUsed() {
        return budgetUsed;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public void setBudgetUsed(BigDecimal budgetUsed) {
        this.budgetUsed = budgetUsed;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }
}
