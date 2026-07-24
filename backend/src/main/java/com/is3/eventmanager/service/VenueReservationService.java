package com.is3.eventmanager.service;

import com.is3.eventmanager.dto.EventVenueReservationDTO;
import com.is3.eventmanager.dto.ReservationRequest;
import com.is3.eventmanager.dto.ReservationResponse;
import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.Venue;
import com.is3.eventmanager.entity.VenueReservation;
import com.is3.eventmanager.repository.EventRepository;
import com.is3.eventmanager.repository.VenueRepository;
import com.is3.eventmanager.repository.VenueReservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class VenueReservationService {

    private final VenueReservationRepository reservationRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public VenueReservationService(
            VenueReservationRepository reservationRepository,
            VenueRepository venueRepository,
            EventRepository eventRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
    }

    public List<ReservationResponse> getReservationsByVenue(Long venueId) {
        List<VenueReservation> reservations = reservationRepository.findByVenueIdAndStatusNot(venueId, "CANCELLED");
        List<ReservationResponse> responses = new ArrayList<>();

        for (VenueReservation res : reservations) {
            LocalDate startDate = res.getStartDate().toLocalDate();
            LocalDate endDate = res.getEndDate().toLocalDate();

            List<String> reservedDates = new ArrayList<>();
            LocalDate curr = startDate;
            while (!curr.isAfter(endDate)) {
                reservedDates.add(curr.format(DATE_FORMATTER));
                curr = curr.plusDays(1);
            }

            List<String> beforeDates = new ArrayList<>();
            for (int i = 4; i >= 1; i--) {
                beforeDates.add(startDate.minusDays(i).format(DATE_FORMATTER));
            }

            List<String> afterDates = new ArrayList<>();
            for (int i = 1; i <= 4; i++) {
                afterDates.add(endDate.plusDays(i).format(DATE_FORMATTER));
            }

            responses.add(new ReservationResponse(
                    startDate.format(DATE_FORMATTER),
                    endDate.format(DATE_FORMATTER),
                    reservedDates,
                    beforeDates,
                    afterDates,
                    res.getStatus()
            ));
        }

        return responses;
    }

    public List<EventVenueReservationDTO> getReservationsByEvent(Long eventId) {
        List<VenueReservation> reservations = reservationRepository.findByEventIdAndStatusNot(eventId, "CANCELLED");
        List<EventVenueReservationDTO> result = new ArrayList<>();

        for (VenueReservation res : reservations) {
            Venue venue = venueRepository.findById(res.getVenueId()).orElse(null);
            if (venue == null) continue;

            LocalDate start = res.getStartDate().toLocalDate();
            LocalDate end = res.getEndDate().toLocalDate();
            long days = ChronoUnit.DAYS.between(start, end) + 1;
            BigDecimal dailyRate = venue.getReferencePrice() != null ? venue.getReferencePrice() : BigDecimal.ZERO;
            BigDecimal total = dailyRate.multiply(BigDecimal.valueOf(days));

            result.add(new EventVenueReservationDTO(
                    res.getId(),
                    venue.getId(),
                    venue.getName(),
                    venue.getCategory(),
                    venue.getDistrict(),
                    venue.getAddress(),
                    venue.getImageUrl(),
                    venue.getMaxCapacity(),
                    dailyRate,
                    total,
                    start.format(DATE_FORMATTER),
                    end.format(DATE_FORMATTER),
                    res.getStatus()
            ));
        }

        return result;
    }

    public ReservationResponse createReservation(Long venueId, ReservationRequest request) {
        LocalDate reqStart = LocalDate.parse(request.getStartDate(), DATE_FORMATTER);
        LocalDate reqEnd = LocalDate.parse(request.getEndDate(), DATE_FORMATTER);

        if (request.getEventId() == null) {
            throw new IllegalArgumentException("Es obligatorio asociar un evento registrado a la reserva del local.");
        }

        if (reqEnd.isBefore(reqStart)) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }

        // Check if any date in requested range [reqStart, reqEnd] overlaps with blocked range [S_exist - 4, E_exist + 4]
        List<ReservationResponse> existing = getReservationsByVenue(venueId);
        for (ReservationResponse res : existing) {
            LocalDate existStart = LocalDate.parse(res.getStartDate(), DATE_FORMATTER);
            LocalDate existEnd = LocalDate.parse(res.getEndDate(), DATE_FORMATTER);

            LocalDate blockedStart = existStart.minusDays(4);
            LocalDate blockedEnd = existEnd.plusDays(4);

            // Check overlap between [reqStart, reqEnd] and [blockedStart, blockedEnd]
            if (!reqEnd.isBefore(blockedStart) && !reqStart.isAfter(blockedEnd)) {
                throw new IllegalArgumentException("El rango de fechas seleccionado no está disponible debido a una reserva existente o período de mantenimiento/limpieza (4 días antes/después).");
            }
        }

        VenueReservation reservation = new VenueReservation();
        reservation.setVenueId(venueId);
        reservation.setEventId(request.getEventId());
        reservation.setStartDate(reqStart.atStartOfDay());
        reservation.setEndDate(reqEnd.atTime(23, 59, 59));
        reservation.setStatus("RESERVED");

        reservationRepository.save(reservation);

        // Accumulate venue reservation cost into event budget_used
        Venue venue = venueRepository.findById(venueId).orElse(null);
        Event event = eventRepository.findById(request.getEventId()).orElse(null);

        if (venue != null && event != null) {
            long daysCount = ChronoUnit.DAYS.between(reqStart, reqEnd) + 1;
            BigDecimal dailyRate = venue.getReferencePrice() != null ? venue.getReferencePrice() : BigDecimal.ZERO;
            BigDecimal reservationCost = dailyRate.multiply(BigDecimal.valueOf(daysCount));

            BigDecimal currentUsed = event.getBudgetUsed() != null ? event.getBudgetUsed() : BigDecimal.ZERO;
            event.setBudgetUsed(currentUsed.add(reservationCost));
            eventRepository.save(event);
        }

        List<String> reservedDates = new ArrayList<>();
        LocalDate curr = reqStart;
        while (!curr.isAfter(reqEnd)) {
            reservedDates.add(curr.format(DATE_FORMATTER));
            curr = curr.plusDays(1);
        }

        List<String> beforeDates = new ArrayList<>();
        for (int i = 4; i >= 1; i--) {
            beforeDates.add(reqStart.minusDays(i).format(DATE_FORMATTER));
        }

        List<String> afterDates = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            afterDates.add(reqEnd.plusDays(i).format(DATE_FORMATTER));
        }

        return new ReservationResponse(
                reqStart.format(DATE_FORMATTER),
                reqEnd.format(DATE_FORMATTER),
                reservedDates,
                beforeDates,
                afterDates,
                "RESERVED"
        );
    }
}
