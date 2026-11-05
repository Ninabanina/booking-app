import type { TimeSlot, Booking, BookingStatus, BookingFormData } from "./types";

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

export type FormErrors = Partial<Record<keyof BookingFormData, string>>

export function validate(data: BookingFormData): FormErrors {
  const next: FormErrors = {}
  if (!data.name.trim()) next.name = 'Name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Enter a valid email'
  if (!data.time) next.time = 'Pick a time slot'
  return next
}