import type { TimeSlot, Booking, BookingStatus } from "./types";

const bookings: Booking[] = [
  { id: 1, name: 'Amy',  email: 'amy@example.com',  date: '2026-10-01', time: '10:00', status: 'pending' },
  { id: 2, name: 'Ben',  email: 'ben@example.com',  date: '2026-10-01', time: '11:00', status: 'confirmed' },
  { id: 3, name: 'Cara', email: 'cara@example.com', date: '2026-10-02', time: '09:00', status: 'confirmed', note: 'first visit' },
]

const slots: TimeSlot[] = [
  { time: '09:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
]

export function getAvailableSlots(slots: TimeSlot[]): TimeSlot[]{
    return slots.filter(slot => slot.available === true)
}

export function findBookingById(bookings: Booking[], id: number): Booking | undefined {
    return  bookings.find(booking => booking.id === id)
}

export function countByStatus(bookings: Booking[]): Record<BookingStatus, number> {
  const initial: Record<BookingStatus, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  }

  return bookings.reduce((counts, booking) => {
    counts[booking.status] += 1
    return counts
  }, initial)
}

type OnSelect = (booking: Booking) => void

export function forEachConfirmed(bookings: Booking[], callback: OnSelect): void {
  bookings
   .filter(booking => booking.status === 'confirmed')
   .forEach(booking => callback(booking))
}

forEachConfirmed(bookings, booking => console.log(booking.name))

export function findBy<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  return items.find(predicate)
} 

const found1 = findBy(bookings, b => b.id === 2)
const found2 = findBy(slots, s => s.time === '10:00')