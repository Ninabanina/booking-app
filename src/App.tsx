import { useEffect, useState } from 'react'
import './App.css'
import { getSlotsForDate, createBooking, deleteBooking, getBookings } from './api'
import { SlotList } from './components/SlotList'
import { BookingForm } from './components/BookingForm'
import type { Booking, BookingFormData, TimeSlot } from './types'
import { BookingList } from './components/BookingList'
import { countByStatus } from './utils'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from './firebase'
import { LoginForm } from './components/LoginForm'

function App() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const counts = countByStatus(bookings)
  const [date, setDate] = useState('2026-10-12')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    getBookings().then(setBookings).catch(console.error)
  }, [])

  useEffect(() => {
    let cancelled = false
    
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getSlotsForDate(date)
        if (cancelled) return
        setSlots(data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message: 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    
    load()
    return () => { cancelled = true }
  }, [date, reloadKey])
  
  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  async function handleBook(data: BookingFormData) {
    setActionError(null)
    try {
      const booking = await createBooking({ ...data, date })
      setBookings([...bookings, booking])
    } catch {
      setActionError('Could not save the booking. Please try again.')
    }
  }

  async function handleCancel(id: string) {
    await deleteBooking(id)
    setBookings(prev => prev.filter(b => b.id !== id))
   }

   function handleConfirm(id: string) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'confirmed' } : b)))
   }

   function handleDateChange(newDate: string) {
    setDate(newDate)
    setSelectedTime(null)
   }

   if (!user) return <LoginForm />

  return (
   <main>
    <h1>Booking</h1>
    <p>Logged in as {user.email} <button onClick={() => signOut(auth)}>Log out</button></p>
    <input type="date" value={date} onChange={e => handleDateChange(e.target.value)} />
    {loading ? <p>Loading…</p> : <SlotList slots={slots} selected={selectedTime} onSelect={setSelectedTime} />}
    {error && (
      <p style={{ color: 'red' }}>
        {error} <button onClick={() => setReloadKey(k => k + 1)}>Retry</button>
      </p>
    )}
    <BookingForm selectedTime={selectedTime} onBook={handleBook}/>
    {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
    <h2>My bookings</h2>
    <BookingList bookings={bookings} onCancel={handleCancel} onConfirm={handleConfirm}/>
    <p>Pending: {counts.pending} - Confirmed: {counts.confirmed} - Cancelled: {counts.cancelled} </p>
   </main>
  )
}

export default App
