# Relational schema for booking-app

The app currently uses Firestore. This is how the same data would look
in a relational database (PostgreSQL).

## Tables

users: one row per account. Email is the login, so it is unique and required.
slots: one row per bookable time on a given date. (date, time) is unique.
bookings: one row per booking. Points to a user and a slot. One-to-many:
a user has many bookings, so the foreign key lives on bookings.

Time is stored only on slots. Bookings reach it through slot_id, so there
is one source of truth.

## Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  UNIQUE (date, time)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  slot_id INT NOT NULL REFERENCES slots(id),
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

## One active booking per slot

A cancelled booking should not block the slot, so slot_id must be unique
only among bookings that are not cancelled. A partial unique index does
that at the database level, which also avoids the race condition of two
users booking at the same moment.

CREATE UNIQUE INDEX one_active_booking_per_slot
ON bookings (slot_id) WHERE status != 'cancelled';

## Common queries

Available slots for a date (slots with no active booking):

SELECT slots.id, slots.time
FROM slots
LEFT JOIN bookings
  ON bookings.slot_id = slots.id AND bookings.status != 'cancelled'
WHERE slots.date = '2026-11-12'
  AND bookings.id IS NULL;

A user's bookings, newest first:

SELECT slots.date, slots.time, bookings.status
FROM bookings
JOIN slots ON slots.id = bookings.slot_id
JOIN users ON users.id = bookings.user_id
WHERE users.email = 'b@test.com'
ORDER BY slots.date DESC, slots.time DESC;

Bookings per status:

SELECT status, COUNT(*) FROM bookings GROUP BY status;