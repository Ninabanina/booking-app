import type { Booking } from '../types'

type BookingListProps = {
    bookings: Booking[]
    onCancel: (id: number) => void
    onConfirm: (id: number) => void
}

export function BookingList({ bookings, onCancel, onConfirm }: BookingListProps) {
    if (bookings.length === 0) return <p>No bookings yet</p>

    return (
        <ul>
            {bookings.map(b => (
                <li key ={b.id}>
                    {b.date || 'no date'} {b.time} - {b.name} - {b.status}
                    <button onClick={() => onCancel(b.id)}>Cancel</button>
                    <button onClick={() => onConfirm(b.id)}>Confirm</button>
                </li>
            ))}
        </ul>
    )

}