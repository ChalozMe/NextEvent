package com.is3.eventmanager.controller;

import com.is3.eventmanager.dto.ReservationRequest;
import com.is3.eventmanager.dto.ReservationResponse;
import com.is3.eventmanager.entity.Venue;
import com.is3.eventmanager.service.VenueReservationService;
import com.is3.eventmanager.service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;
    private final VenueReservationService reservationService;

    public VenueController(VenueService venueService, VenueReservationService reservationService) {
        this.venueService = venueService;
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<Venue> getVenues(@RequestParam(required = false) String category) {
        return venueService.getVenuesByCategory(category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/reservations")
    public List<ReservationResponse> getReservations(@PathVariable Long id) {
        return reservationService.getReservationsByVenue(id);
    }

    @PostMapping("/{id}/reservations")
    public ResponseEntity<?> createReservation(@PathVariable Long id, @RequestBody ReservationRequest request) {
        try {
            ReservationResponse response = reservationService.createReservation(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
