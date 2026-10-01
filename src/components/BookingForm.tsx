import { useState } from "react";
import type { BookingFormData } from "../types";

const empty: BookingFormData ={
    name: '',
    email: '',
    date: '',
    time: '',
    note: '',
}

export function BookingForm() {
    const [form, setForm] = useState<BookingFormData>(empty)

    function update(field: keyof BookingFormData, value: string) {
        setForm({...form, [field]: value})
    }

    return (
        <form>
            <label>
                Name
                <input value={form.name} onChange={e => update('name', e.target.value)} />
            </label>
            <label>
                Email
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
            </label>
            <label>
                Note
                <textarea value={form.note} onChange={e => update('note', e.target.value)} />
            </label>
            <pre>{JSON.stringify(form, null, 2)}</pre>
        </form>
    )
}