import type { TimeSlot, Booking, BookingStatus } from "./types";

export function getAvailableSlots(slots: TimeSlot[]): TimeSlot[]{
    return slots.filter(slot => slot.available === true)
}

export function findBookingById(bookings: Booking[], id: string): Booking | undefined {
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

export function findBy<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  return items.find(predicate)
} 