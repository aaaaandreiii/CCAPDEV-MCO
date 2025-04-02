import { useEffect, useState } from "react";
import axios from "axios";

const LabAvailability = ({ labID }) => {
    const [availability, setAvailability] = useState([]);

    useEffect(() => {
        axios.get(`/api/labs/${labID}`)
            .then(response => {
                setAvailability(response.data.availability);
            })
            .catch(error => console.error("Error fetching lab availability:", error));
    }, [labID]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Lab Availability</h2>
            {availability.length === 0 ? (
                <p>No availability data</p>
            ) : (
                <ul>
                    {availability.map((day, index) => (
                        <li key={index} className="mt-2">
                            <strong>{day.day}</strong>
                            <ul>
                                {day.slots.map((slot, i) => (
                                    <li key={i}>
                                        {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LabAvailability;
