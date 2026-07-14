package com.is3.eventmanager.service;

import com.is3.eventmanager.entity.Venue;
import com.is3.eventmanager.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id);
    }

    public List<Venue> getVenuesByCategory(String category) {
        if (category == null || category.trim().isEmpty() || category.equalsIgnoreCase("todos")) {
            return venueRepository.findAll();
        }
        return venueRepository.findByCategoryIgnoreCase(category);
    }
}
