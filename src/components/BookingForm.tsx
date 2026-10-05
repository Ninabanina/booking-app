import { useState } from "react";
import type { BookingFormData } from "../types";

type FormErrors = Partial<Record<keyof BookingFormData, string>>

const empty: BookingFormData ={
    name: '',
    email: '',
    date: '',
    time: '',
    note: '',
}

export function BookingForm() {
    const [form, setForm] = useState<BookingFormData>(empty)
    const [errors, setErrors] = useState<FormErrors>({})

    function validate(data: BookingFormData):FormErrors{
        const next: FormErrors = {}
        if(!data.name.trim()) next.name = 'Name is required'
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Enter a valid email'
        return next
    }

    function update(field: keyof BookingFormData, value: string) {
        const next = {...form, [field]: value}
        setForm(next)
        setErrors(validate(next))
    }

    function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const next = validate(form)
        setErrors(next)
        if (Object.keys(next).length >0) return
        console.log('submit', form)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name
                <input value={form.name} onChange={e => update('name', e.target.value)} />
                {errors.name && <span style={{ color:'red' }}>{errors.name}</span>}
            </label>
            <label>
                Email
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                {errors.email && <span style={{ color:'red' }}>{errors.email}</span>}
            </label>
            <label>
                Note
                <textarea value={form.note} onChange={e => update('note', e.target.value)} />
            </label>
            <pre>{JSON.stringify(form, null, 2)}</pre>
            <button type="submit" disabled={Object.keys(errors).length > 0}>Book</button>
        </form>
    )
}
