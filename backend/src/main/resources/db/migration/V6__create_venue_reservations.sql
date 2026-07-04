CREATE TABLE venue_reservations (
    id BIGSERIAL PRIMARY KEY,

    event_id BIGINT NOT NULL,
    venue_id BIGINT NOT NULL,

    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,

    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_reservation_event
        FOREIGN KEY (event_id) REFERENCES events(id),

    CONSTRAINT fk_reservation_venue
        FOREIGN KEY (venue_id) REFERENCES venues(id)
);
