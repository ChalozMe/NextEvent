CREATE TABLE tasks (

    id BIGSERIAL PRIMARY KEY,

    event_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    due_date TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',

    phase VARCHAR(30) NOT NULL,

    assigned_to VARCHAR(255),

    completed_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);
