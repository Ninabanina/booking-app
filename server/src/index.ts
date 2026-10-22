import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

type TimeSlot = { time: string; available: boolean }
type Booking = {
  id: number
  name: string
  email: string
  date: string
  time: string
  note?: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

const slotsByDate: Record<string, TimeSlot[]> = {
  '2026-10-20': [
    { time: '09:00', available: false },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
  ],
  '2026-10-21': [
    { time: '09:00', available: true },
    { time: '14:00', available: true },
  ],
}

app.get('/api/slots', (req, res) => {
    const date = req.query.date as string
    res.json(slotsByDate[date] ?? [])
})

const bookings: Booking[] = []
app.post('/api/bookings', (req, res) => {
  const { name, email, date, time, note } = req.body
  if(!name || !email || !date || !time) {
    return res.status(400).json({ error: 'name, email, date and time are required'})
  }
  const booking: Booking = { id: Date.now(), name, email, date, time, note, status: 'pending' }
  bookings.push(booking)
  res.status(201).json(booking)
})

app.delete('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = bookings.findIndex(b => b.id === id)
  if (index === -1) return res.status(404).json({ error: 'Booking not found' })
  bookings.splice(index, 1)
  res.status(204).end()
})

app.get('/api/bookings', (req, res) => res.json(bookings))

 app.listen(3001, () => console.log('API on http://localhost:3001'))