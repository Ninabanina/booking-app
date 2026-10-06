import { useState } from 'react'
import './App.css'
import { SlotList } from './components/SlotList'
import { BookingForm } from './components/BookingForm'
import type { TimeSlot } from './types'

const slots: TimeSlot[] = [
  { time: '09:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true }
]

function App() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  return (
   <main>
    <h1>Booking</h1>
    <SlotList slots={slots} selected={selectedTime} onSelect={setSelectedTime}/>
    <BookingForm selectedTime={selectedTime}/>
   </main>
  )
}

export default App
