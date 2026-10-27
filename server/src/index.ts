import express from 'express'
import cors from 'cors'
import { db } from './db.js'
console.log('Firestore ready:', !!db)

const app = express()
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

type TimeSlot = { time: string; available: boolean }
type Booking = {
  id: string
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

app.post('/api/bookings', async(req, res) => {
  const { name, email, date, time, note } = req.body
  if(!name || !email || !date || !time) {
    return res.status(400).json({ error: 'name, email, date and time are required'})
  }
  const data = { name, email, date, time, note: note ?? '', status: 'pending' }
  const ref = await db.collection('bookings').add(data)
  res.status(201).json({ id:ref.id, ...data })
})

app.delete('/api/bookings/:id', async(req, res) => {
  const ref = db.collection('bookings').doc(req.params.id)
  const doc = await ref.get()
  if (!doc.exists) return res.status(404).json({ error: 'Booking not found' })
  await ref.delete()
  res.status(204).end()
})

app.get('/api/bookings', async(req, res) => {
  const snapshot = await db.collection('bookings').get()
  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  res.json(bookings)
})

 app.listen(3001, () => console.log('API on http://localhost:3001'))