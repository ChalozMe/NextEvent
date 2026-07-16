package com.is3.eventmanager.service;

import com.is3.eventmanager.dto.ReservationRequest;
import com.is3.eventmanager.dto.ReservationResponse;
import com.is3.eventmanager.entity.VenueReservation;
import com.is3.eventmanager.repository.VenueReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class VenueReservationService {

    private final VenueReservationRepository reservationRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public VenueReservationService(VenueReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<ReservationResponse> getReservationsByVenue(Long venueId) {
        List<VenueReservation> reservations = reservationRepository.findByVenueIdAndStatusNot(venueId, "CANCELLED");
        List<ReservationResponse> responses = new ArrayList<>();

        for (VenueReservation res : reservations) {
            LocalDate reservedDate = res.getStartDate().toLocalDate();
            String dateStr = reservedDate.format(DATE_FORMATTER);

            List<String> beforeDates = new ArrayList<>();
            for (int i = 4; i >= 1; i--) {
                beforeDates.add(reservedDate.minusDays(i).format(DATE_FORMATTER));
            }

            List<String> afterDates = new ArrayList<>();
            for (int i = 1; i <= 4; i++) {
                afterDates.add(reservedDate.plusDays(i).format(DATE_FORMATTER));
            }

            responses.add(new ReservationResponse(dateStr, beforeDates, afterDates, res.getStatus()));
        }

        return responses;
    }

    public ReservationResponse createReservation(Long venueId, ReservationRequest request) {
        LocalDate requestDate = LocalDate.parse(request.getDate(), DATE_FORMATTER);

        // Check if date or date within 4 days before/after existing reservations is blocked
        List<ReservationResponse> existing = getReservationsByVenue(venueId);
        for (ReservationResponse res : existing) {
            LocalDate reservedDate = LocalDate.parse(res.getReservedDate(), DATE_FORMATTER);
            long daysDiff = Math.abs(requestDate.toEpochDay() - reservedDate.toEpochDay());

            if (daysDiff <= 4) {
                throw new IllegalArgumentException("La fecha seleccionada no está disponible debido a una reserva existente o mantenimiento/limpieza (4 días antes/después).");
            }
        }

        VenueReservation reservation = new VenueReservation();
        reservation.setVenueId(venueId);
        reservation.setEventId(request.getEventId());
        reservation.setStartDate(requestDate.atStartOfDay());
        reservation.setEndDate(requestDate.atTime(23, 59, 59));
        reservation.setStatus("RESERVED");

        reservationRepository.save(reservation);

        List<String> beforeDates = new ArrayList<>();
        for (int i = 4; i >= 1; i--) {
            beforeDates.add(requestDate.minusDays(i).format(DATE_FORMATTER));
        }

        List<String> afterDates = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            afterDates.add(requestDate.plusDays(i).format(DATE_FORMATTER));
        }

        return new ReservationResponse(request.getDate(), beforeDates, afterDates, "RESERVED");
    }
}
