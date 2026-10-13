import { useEffect, useState } from 'react'
import './App.css'
import { SlotList } from './components/SlotList'
import { BookingForm } from './components/BookingForm'
import type { Booking, BookingFormData, TimeSlot } from './types'
import { BookingList } from './components/BookingList'
import { countByStatus } from './utils'

const slotsByDate: Record<string, TimeSlot[]> = {
  '2026-10-12': [
    { time: '09:00', available: false },
    { time: '10:00', available: true },
    { time: '11:00', available: true }
  ],
  '2026-10-13': [
    { time: '09:00', available: true },
    { time: '14:00', available: true },
  ]
}

function App() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const counts = countByStatus(bookings)
  const [date, setDate] = useState('2026-10-12')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getSlotsForDate(date).then(data => {
      if (cancelled) return
      setSlots(data)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [date])

  function handleBook(data: BookingFormData) {
    const newBooking: Booking = {
      ...data,
      id: Date.now(),
      status: 'pending',
      date
    }
    setBookings([...bookings, newBooking])
  }

   function handleCancel(id: number) {
    setBookings(prev => prev.filter(b => b.id !== id))
   }

   function handleConfirm(id: number) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'confirmed' } : b)))
   }

   function getSlotsForDate(date: string): Promise<TimeSlot[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(slotsByDate[date] ?? []), 600)
    })
   }

   function handleDateChange(newDate: string) {
    setDate(newDate)
    setSelectedTime(null)
   }

  return (
   <main>
    <h1>Booking</h1>
    <input type="date" value={date} onChange={e => handleDateChange(e.target.value)} />
    {loading ? <p>Loading…</p> : <SlotList slots={slots} selected={selectedTime} onSelect={setSelectedTime} />}
    <BookingForm selectedTime={selectedTime} onBook={handleBook}/>
    <h2>My bookings</h2>
    <BookingList bookings={bookings} onCancel={handleCancel} onConfirm={handleConfirm}/>
    <p>Pending: {counts.pending} - Confirmed: {counts.confirmed} - Cancelled: {counts.cancelled} </p>
   </main>
  )
}

export default App
