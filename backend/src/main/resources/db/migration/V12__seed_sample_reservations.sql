ALTER TABLE venue_reservations ALTER COLUMN event_id DROP NOT NULL;

INSERT INTO venue_reservations (venue_id, start_date, end_date, status) VALUES
(1, '2025-07-20 00:00:00', '2025-07-20 23:59:59', 'RESERVED'),
(2, '2025-07-15 00:00:00', '2025-07-15 23:59:59', 'RESERVED'),
(3, '2025-07-25 00:00:00', '2025-07-25 23:59:59', 'RESERVED');
