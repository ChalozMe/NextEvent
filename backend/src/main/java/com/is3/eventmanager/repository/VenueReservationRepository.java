package com.is3.eventmanager.repository;

import com.is3.eventmanager.entity.VenueReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueReservationRepository extends JpaRepository<VenueReservation, Long> {
    List<VenueReservation> findByVenueId(Long venueId);
    List<VenueReservation> findByVenueIdAndStatusNot(Long venueId, String status);
}
