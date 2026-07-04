CREATE TABLE venues (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    max_capacity INTEGER NOT NULL,
    reference_price NUMERIC(10,2)
);
