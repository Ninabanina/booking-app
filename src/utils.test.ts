import { describe, it, expect } from 'vitest'
import { validate, countByStatus, getAvailableSlots } from './utils'

describe('validate', () => {
    it('returns no errors for a valid form', () => {
        const errors = validate({ name: 'Nina', email: 'n@x.com', date: '2026-10-20', time: '10:00', note: '' })
        expect(errors).toEqual({})
    })

    it('requires a name', () => {
        const errors = validate({ name: '  ', email: 'n@x.com', date: '', time: '10:00', note: '' })
        expect(errors.name).toBe('Name is required')
    })   

    it('rejects a bad email', () => {
        const errors = validate({ name: 'Nina', email: 'not-an-email', date: '', time: '10:00', note: '' })
        expect(errors.email).toBe('Enter a valid email')
    })

    it('requires a time slot', () => {
        const errors = validate({ name: 'Nina', email: 'n@x.com', date: '', time: '', note: '' })
        expect(errors.time).toBe('Pick a time slot')
    })
})

describe('countByStatus', () => {
  it('counts each status', () => {
    const bookings = [
      { id: 'a', name: 'A', email: 'a@x.com', date: '', time: '09:00', status: 'pending' as const },
      { id: 'b', name: 'B', email: 'b@x.com', date: '', time: '10:00', status: 'confirmed' as const },
      { id: 'c', name: 'C', email: 'c@x.com', date: '', time: '11:00', status: 'confirmed' as const },
    ]
    expect(countByStatus(bookings)).toEqual({ pending: 1, confirmed: 2, cancelled: 0 })
  })

  it('returns zeros for an empty list', () => {
    expect(countByStatus([])).toEqual({ pending: 0, confirmed: 0, cancelled: 0 })
  })
})

describe('getAvailableSlots', () => {
  it('keeps only available slots', () => {
    const slots = [
      { time: '09:00', available: false },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ]
    expect(getAvailableSlots(slots).map(s => s.time)).toEqual(['10:00', '11:00'])
  })

  it('does not change the original array', () => {
    const slots = [{ time: '09:00', available: false }]
    getAvailableSlots(slots)
    expect(slots).toHaveLength(1)
  })
})