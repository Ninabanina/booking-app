import { useState, useRef, type SubmitEvent } from 'react'
import type { BookingFormData } from '../types'
import { validate } from '../utils'

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

export function BookingForm({ selectedTime, onBook }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>(empty)
  const [touched, setTouched] = useState(false)

  const data = { ...form, time: selectedTime ?? '' }
  const errors = validate(data)
  const hasErrors = Object.keys(errors).length > 0

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  function update(field: keyof BookingFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setTouched(true)
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    if (hasErrors) {
      if (errors.name) nameRef.current?.focus()
      else if (errors.email) emailRef.current?.focus()
      return
    }
    onBook(data)
    setForm(empty)
    setTouched(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Time: {selectedTime ?? 'not selected'}</p>
      {touched && errors.time && <span id="time-error" role="alert" style={{ color: 'red' }}>{errors.time}</span>}
      <label>
        Name
        <input value={form.name} onChange={e => update('name', e.target.value)} aria-invalid={touched && !!errors.name} aria-describedby="name-error"/>
        {touched && errors.name && <span id="name-error" role="alert" style={{ color: 'red' }}>{errors.name}</span>}
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} aria-invalid={touched && !!errors.email} aria-describedby="email-error"/>
        {touched && errors.email && <span id="email-error" role="alert" style={{ color: 'red' }}>{errors.email}</span>}
      </label>
      <label>
        Note
        <textarea value={form.note} onChange={e => update('note', e.target.value)} />
      </label>
      <button type="submit" disabled={touched && hasErrors}>Book</button>
    </form>
  )
}