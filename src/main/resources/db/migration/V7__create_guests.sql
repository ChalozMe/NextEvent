CREATE TABLE guests (
    id BIGSERIAL PRIMARY KEY,

    event_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,

    token VARCHAR(255) UNIQUE,

    CONSTRAINT fk_guest_event
        FOREIGN KEY (event_id) REFERENCES events(id)
);
