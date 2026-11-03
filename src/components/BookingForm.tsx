import { useState, type SubmitEvent } from 'react'
import type { BookingFormData } from '../types'

type FormErrors = Partial<Record<keyof BookingFormData, string>>
type BookingFormProps = {
  selectedTime: string | null
  onBook: (data: BookingFormData) => void
}

const empty: BookingFormData = {
  name: '',
  email: '',
  date: '',
  time: '',
  note: '',
}

function validate(data: BookingFormData): FormErrors {
  const next: FormErrors = {}
  if (!data.name.trim()) next.name = 'Name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Enter a valid email'
  if (!data.time) next.time = 'Pick a time slot'
  return next
}

export function BookingForm({ selectedTime, onBook }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>(empty)
  const [touched, setTouched] = useState(false)

  const data = { ...form, time: selectedTime ?? '' }
  const errors = validate(data)
  const hasErrors = Object.keys(errors).length > 0

  function update(field: keyof BookingFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setTouched(true)
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    if (hasErrors) return
    onBook(data)
    setForm(empty)
    setTouched(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Time: {selectedTime ?? 'not selected'}</p>
      {touched && errors.time && <span style={{ color: 'red' }}>{errors.time}</span>}
      <label>
        Name
        <input value={form.name} onChange={e => update('name', e.target.value)} />
        {touched && errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        {touched && errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </label>
      <label>
        Note
        <textarea value={form.note} onChange={e => update('note', e.target.value)} />
      </label>
      <button type="submit" disabled={touched && hasErrors}>Book</button>
    </form>
  )
}