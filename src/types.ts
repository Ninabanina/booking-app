export interface TimeSlot {
    time:string,
    available:boolean
}

export type BookingFormData = Omit<Booking, 'id' | 'status'>

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
    id:number,
    name:string,
    email:string,
    date:string,
    time: string,
    note?:string,
    status:BookingStatus
}