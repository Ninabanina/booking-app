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

 app.listen(3001, () => console.log('API on http://localhost:3001'))