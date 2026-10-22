import type { Booking, BookingFormData, TimeSlot } from './types'

const BASE = 'http://localhost:3001/api'

export async function getSlotsForDate(date: string): Promise<TimeSlot[]> {
  const res = await fetch(`${BASE}/slots?date=${date}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if(!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteBooking(id: number): Promise<void> {
  const res = await fetch(`${BASE}/bookings/${id}`, { method: 'DELETE'})
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE}/bookings`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}