import type { TimeSlot } from './types'

const BASE = 'http://localhost:3001/api'

export async function getSlotsForDate(date: string): Promise<TimeSlot[]> {
  const res = await fetch(`${BASE}/slots?date=${date}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}