import type { TimeSlot } from "../types";
import { getAvailableSlots } from "../utils";
import { useState } from "react";

type SlotListProps = {
    slots: TimeSlot[]
}

export function SlotList({slots}: SlotListProps){
    const [selected, setSelected] = useState<string | null>(null)
    const available = getAvailableSlots(slots)

    return (
        <ul>
            {available.map(slot => (
                <li key={slot.time}>
                    <button onClick={() => setSelected(slot.time)}
                            style={{ fontWeight: selected === slot.time? 'bold' : 'normal'}}
                    >
                        {slot.time}
                    </button>
                </li>
            ))}
        </ul>
    )

}