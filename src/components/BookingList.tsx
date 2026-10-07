import type { Booking } from '../types'

type BookingListProps = {
    bookings: Booking[]
}

export function BookingList({ bookings }: BookingListProps) {
    if (bookings.length === 0) return <p>No bookings yet</p>

    return (
        <ul>
            {bookings.map(b => (
                <li key ={b.id}>
                    {b.date || 'no date'} {b.time} - {b.name} - {b.status}
                </li>
            ))}
        </ul>
    )

}