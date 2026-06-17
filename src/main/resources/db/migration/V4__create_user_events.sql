CREATE TABLE user_events (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,

    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_events_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT fk_user_events_event
        FOREIGN KEY (event_id) REFERENCES events(id),

    CONSTRAINT uk_user_event
        UNIQUE(user_id, event_id)
);
