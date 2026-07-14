package com.is3.eventmanager.repository;

import com.is3.eventmanager.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByCategoryIgnoreCase(String category);
}
