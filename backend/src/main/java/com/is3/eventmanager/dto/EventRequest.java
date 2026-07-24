package com.is3.eventmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventRequest {

    private String name;
    private String type;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private Integer capacity;

    private String location;
    private String description;

    private BigDecimal budget;

    private String coverImage;
    private String status;
}
