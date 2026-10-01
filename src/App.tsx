import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import './utils'
import { SlotList } from './components/SlotList'
import { BookingForm } from './components/BookingForm'
import type { TimeSlot } from './types'

const slots: TimeSlot[] = [
  { time: '9:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true }
]

function App() {
  return (
   <main>
    <h1>Booking</h1>
    <SlotList slots={slots} />
    <BookingForm />
   </main>
  )
}

export default App
