import type { Booking, BookingFormData, TimeSlot } from './types'
import { auth } from './firebase'

const BASE = 'http://localhost:3001/api'

export async function getSlotsForDate(date: string): Promise<TimeSlot[]> {
  const res = await fetch(`${BASE}/slots?date=${date}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(data),
  })
  if(!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`${BASE}/bookings/${id}`, { method: 'DELETE', headers: await authHeaders()})
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE}/bookings`, { headers: await authHeaders() })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}