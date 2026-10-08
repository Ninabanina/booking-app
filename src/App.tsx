import { useState } from 'react'
import './App.css'
import { SlotList } from './components/SlotList'
import { BookingForm } from './components/BookingForm'
import type { Booking, BookingFormData, TimeSlot } from './types'
import { BookingList } from './components/BookingList'
import { countByStatus } from './utils'

const slots: TimeSlot[] = [
  { time: '09:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true }
]

function App() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const counts = countByStatus(bookings)

  function handleBook(data: BookingFormData) {
    const newBooking: Booking = {
      ...data,
      id: Date.now(),
      status: 'pending'
    }
    setBookings([...bookings, newBooking])
  }

   function handleCancel(id: number) {
    setBookings(prev => prev.filter(b => b.id !== id))
   }

   function handleConfirm(id: number) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'confirmed' } : b)))
   }

  return (
   <main>
    <h1>Booking</h1>
    <SlotList slots={slots} selected={selectedTime} onSelect={setSelectedTime}/>
    <BookingForm selectedTime={selectedTime} onBook={handleBook}/>
    <h2>My bookings</h2>
    <BookingList bookings={bookings} onCancel={handleCancel} onConfirm={handleConfirm}/>
    <p>Pending: {counts.pending} - Confirmed: {counts.confirmed} - Cancelled: {counts.cancelled} </p>
   </main>
  )
}

export default App
