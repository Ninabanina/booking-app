import express from 'express'
import cors from 'cors'
import { db } from './db.js'
console.log('Firestore ready:', !!db)
import { getAuth } from 'firebase-admin/auth'
import type { Request, Response, NextFunction } from 'express'

const app = express()
app.use(cors())
app.use(express.json())

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  try {
    const decoded = await getAuth().verifyIdToken(header.slice(7))
    res.locals.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

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

app.post('/api/bookings', requireAuth, async(req, res) => {
  const { name, email, date, time, note } = req.body
  if(!name || !email || !date || !time) {
    return res.status(400).json({ error: 'name, email, date and time are required'})
  }
  const data = { name, email, date, time, note: note ?? '', status: 'pending', uid: res.locals.uid }
  const ref = await db.collection('bookings').add(data)
  res.status(201).json({ id:ref.id, ...data })
})

app.delete('/api/bookings/:id', requireAuth, async(req, res) => {
  const ref = db.collection('bookings').doc(String(req.params.id))
  const doc = await ref.get()
  if (!doc.exists) return res.status(404).json({ error: 'Booking not found' })
  if (doc.data()?.uid !== res.locals.uid) return res.status(403).json({ error: 'Not your booking' })
  await ref.delete()
  res.status(204).end()
})

app.get('/api/bookings', requireAuth, async(req, res) => {
  const snapshot = await db.collection('bookings').where('uid', '==', res.locals.uid).get()
  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  res.json(bookings)
})

 app.listen(3001, () => console.log('API on http://localhost:3001'))