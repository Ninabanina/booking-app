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

export function BookingForm({selectedTime, onBook}: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>(empty)
  const [errors, setErrors] = useState<FormErrors>({})

  function update(field: keyof BookingFormData, value: string) {
    const next = { ...form, [field]: value }
    setForm(next)
    setErrors(validate({ ...next, time: selectedTime ?? ''}))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = {...form, time: selectedTime ?? ''}
    const next = validate(data)
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onBook(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Time: {selectedTime ?? 'not selected'}</p>
      <label>
        Name
        <input value={form.name} onChange={e => update('name', e.target.value)} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </label>
      <label>
        Note
        <textarea value={form.note} onChange={e => update('note', e.target.value)} />
      </label>
      <pre>{JSON.stringify(errors)}</pre>
      <button type="submit" disabled={Object.keys(errors).length > 0}>Book</button>
    </form>
  )
}