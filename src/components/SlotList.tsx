import type { TimeSlot } from "../types";
import { getAvailableSlots } from "../utils";
import { useState } from "react";

type SlotListProps = {
    slots: TimeSlot[]
    selected: string | null
    onSelect: (time: string) => void
}

export function SlotList({slots, selected, onSelect}: SlotListProps){
    const available = getAvailableSlots(slots)

    return (
        <ul>
            {available.map(slot => (
                <li key={slot.time}>
                    <button onClick={() => onSelect(slot.time)}
                            style={{ fontWeight: selected === slot.time? 'bold' : 'normal'}}
                    >
                        {slot.time}
                    </button>
                </li>
            ))}
        </ul>
    )

}