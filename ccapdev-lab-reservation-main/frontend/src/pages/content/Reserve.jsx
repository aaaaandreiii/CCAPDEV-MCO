import { useAuth } from '../../AuthProvider.jsx';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSnackbar } from "notistack";
import axios from 'axios';

export default function Reserve() {
    const API_BASE_URL = "http://localhost:5000/api";
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();

    const [error, setError] = useState("");
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [times, setTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);


    useEffect(() => {
        fetchRooms();
        generateDays();
    }, []);

    useEffect(() => {
        if (selectedRoom && selectedDay) {
            setTimes([]);
            setSelectedTime(null);
            setSeats([]);
            fetchAvailableSlots(); 
        } else {
            setTimes([]);
            setSelectedTime(null);
            setSeats([]);
        }
    }, [selectedRoom, selectedDay]);

    useEffect(() => {
        if (selectedRoom && selectedTime) {
            setSeats([]);
            fetchSeats();
        } else {
            setSeats([]);
        }
    }, [selectedRoom, selectedTime]);

    const generateDays = () => {
        let arr = [];
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let day = new Date(today);
            day.setDate(today.getDate() + i);
            day.setHours(0, 0, 0, 0);
            arr.push({
                label: day.toDateString(),
                value: day.toISOString().split("T")[0]
            });
        }

        setDays(arr);
        setSelectedDay(arr[0] || null);
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/labs`);
            const roomOptions = response.data.map(lab => ({
                label: lab.name,
                value: lab._id
            }));
            setRooms(roomOptions);
        } catch (error) {
            console.error('❌ Error fetching labs:', error);
            enqueueSnackbar('Failed to load rooms.', { variant: 'error' });
        }
    };

    const fetchAvailableSlots = async () => {
        if (!selectedRoom?.value || !selectedDay?.value) return;
    
        console.log(`📡 Fetching slots for Room: ${selectedRoom.label}, Date: ${selectedDay.value}`);
    
        try {
            const response = await axios.get(`${API_BASE_URL}/available-slots/${selectedRoom.value}/${selectedDay.value}`);
            console.log("📡 Raw API Response:", response.data);
    
            const availableSlots = response.data?.availableSlots ?? [];
    
            if (availableSlots.length === 0) {
                console.warn("⚠️ No available time slots found!");
                setTimes([]);
                setSelectedTime(null);
                return;
            }
    
            const formattedSlots = availableSlots.map(slot => {
                try {
                    const startTime = new Date(`${selectedDay.value}T${slot.startTime}:00`);
                    const endTime = new Date(`${selectedDay.value}T${slot.endTime}:00`);
    
                    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                        console.warn(`⛔ Invalid time format received: Start - ${slot.startTime}, End - ${slot.endTime}`);
                        return null;
                    }
    
                    return {
                        label: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`,
                        value: startTime.toISOString()
                    };
                } catch (error) {
                    console.error("❌ Error parsing time slot:", error);
                    return null;
                }
            }).filter(Boolean);
    
            console.log("✅ Formatted Slots:", formattedSlots);
            setTimes(formattedSlots);
            setSelectedTime(null); 
        } catch (error) {
            console.error('❌ Error fetching available slots:', error);
            enqueueSnackbar('Failed to load time slots.', { variant: 'error' });
            setTimes([]);
            setSelectedTime(null);
        }
    };
    
    const fetchSeats = async () => {
        if (!selectedRoom?.value || !selectedTime?.value) {
            console.log("⏳ Waiting for room & time selection for seats...");
            setSeats([]);
            return;
        }

        console.log(`Workspaceing seats for Room: ${selectedRoom.label}, Time Value: ${selectedTime.value}`);

        try {
            const response = await axios.get(`${API_BASE_URL}/seats/${selectedRoom.value}/${selectedTime.value}`);
            console.log("✅ Fetched seats:", response.data);

            if (!response.data || response.data.length === 0) {
                console.warn("⚠️ No available seats found for this slot!");
                setSeats([]);
            } else {
                setSeats(response.data.map(seat => ({ ...seat, selected: false })));
            }
        } catch (error) {
            console.error("❌ Error fetching seats:", error);
            enqueueSnackbar('Failed to load seats.', { variant: 'error' });
            setSeats([]);
        }
    };

    const handleSeatSelection = (seatToToggle) => {
        //allows only one seat to be selected at a time
        setSeats(prevSeats =>
            prevSeats.map(s => ({
                ...s,
                //if it's the clicked seat, toggle its selected state
                //if it's not the clicked seat, set its selected state to false
                selected: s._id === seatToToggle._id ? !s.selected : false
            }))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const selectedSeatObject = seats.find(seat => seat.selected);

        if (!selectedRoom) {
            enqueueSnackbar('Please select a room.', { variant: 'warning' }); return;
        }
        if (!selectedDay) {
            enqueueSnackbar('Please select a date.', { variant: 'warning' }); return;
        }
        if (!selectedTime) {
            enqueueSnackbar('Please select a time slot.', { variant: 'warning' }); return;
        }
        if (!selectedSeatObject) {
            enqueueSnackbar('Please select a seat.', { variant: 'warning' }); return;
        }
        if (!auth?.user?.id) {
            enqueueSnackbar('Error: User not identified. Please log in again.', { variant: 'error' });
            console.error("❌ User ID not found in auth context");
            return;
        }

        const isAnonymous = e.target.elements.anonymous.checked;
        console.log("Anonymous reservation:", isAnonymous);

        let endTime;
        try {
            const startTimeDate = new Date(selectedTime.value);
             if (isNaN(startTimeDate.getTime())) {
                 throw new Error('Invalid start time value');
             }
            endTime = new Date(startTimeDate.getTime() + 60 * 60000).toISOString(); // 1 hour duration
        } catch (dateError) {
             console.error("❌ Error calculating end time:", dateError);
             enqueueSnackbar('Error processing reservation time.', { variant: 'error' });
             return;
        }

        const reservationData = {
            userID: auth.user.id,
            labID: selectedRoom.value,
            timeSlots: selectedTimes.map(t => t.value),
            seatNumber: selectedSeatObject.seatNumber,
            isAnonymous: isAnonymous
        };        

        console.log("Submitting reservation:", reservationData);

        try {
            const response = await axios.post(`${API_BASE_URL}/reserve`, reservationData);

            console.log("✅ Reservation response:", response.data);
            enqueueSnackbar('Successfully reserved!', { variant: 'success' });

            setSelectedRoom(null);
            setSelectedDay(days[0] || null);
            setSelectedTime(null);
            setSeats([]);
            setError("");
            if(e.target.elements.anonymous) {
                e.target.elements.anonymous.checked = false;
            }
        } catch (error) {
            console.error('❌ Reservation error:', error);
            const errorMsg = error.response?.data?.message || 'Error making reservation. The slot might have been taken.';
            setError(errorMsg);
            enqueueSnackbar(`Reservation failed: ${errorMsg}`, { variant: 'error' });
        }
    };

    return (
        <div className="flex flex-col p-4"> {/* Main container with padding */}
            <h1 className='capitalize font-bold text-[24px] text-fontgray pb-3'>Reserve a Seat</h1>
            <form onSubmit={handleSubmit} className="space-y-4"> {/* Form with vertical spacing */}

                {/* Room Selection */}
                <div>
                    <label className="formlabel required block mb-1" htmlFor="room">Room</label>
                    <Select
                        id="room"
                        className='w-full md:w-[300px]'
                        options={rooms}
                        value={selectedRoom}
                        onChange={setSelectedRoom}
                        placeholder="Select a room..."
                        isClearable
                    />
                </div>

                {/* Date Selection */}
                <div>
                    <label className="formlabel required block mb-1" htmlFor="day">Reservation Date</label>
                    <Select
                        id="day"
                        className='w-full md:w-[300px]'
                        options={days}
                        value={selectedDay}
                        onChange={setSelectedDay}
                        placeholder="Select a date..."
                    />
                </div>

                {/* Time Slot Selection */}
                <div>
                    <label className="formlabel required block mb-1" htmlFor="timeslot">Time Slot</label>
                    <Select
                        id="timeslot"
                        className="w-full md:w-[450px]"
                        options={times}
                        value={selectedTime}
                        onChange={setSelectedTime}
                        isMulti
                        placeholder={selectedRoom && selectedDay ? (times.length > 0 ? "Select a time slot..." : "No slots available for this day") : "Select room and date first..."}
                        isDisabled={!selectedRoom || !selectedDay || times.length === 0}
                        isClearable
                        noOptionsMessage={() => (!selectedRoom || !selectedDay) ? "Select room and date first" : "No available slots"}
                    />

                </div>

                {/* Seat Selection Area */}
                <div>
                    <label className="formlabel required block mb-1">Available Seats</label>
                    <div className='flex flex-wrap gap-2 p-3 border rounded bg-gray-50 min-h-[50px] w-full md:w-[450px]'> {/* Container for seat buttons */}
                        {/* Render seat buttons only if room, day, and time are selected */}
                        {selectedRoom && selectedDay && selectedTime ? (
                            seats.length > 0 ? (
                                seats.map(seat => (
                                    <button
                                        key={seat._id}
                                        type="button"
                                        onClick={() => handleSeatSelection(seat)}
                                        className={`px-3 py-1.5 border rounded transition-colors duration-150 ease-in-out ${
                                            seat.selected
                                                ? 'bg-green-500 text-white border-green-600 ring-2 ring-green-300'
                                                : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 cursor-pointer'
                                        }`}
                                    >
                                        Seat {seat.seatNumber} {/* Display seat number */}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No available seats for this time slot.</p>
                            )
                        ) : (
                            <p className="text-gray-500 italic">Select room, date, and time to view seats.</p>
                        )}
                    </div>
                </div>

                 {/* Anonymous Reservation Checkbox */}
                <div className="flex items-center mt-3">
                    <input type="checkbox" id="anonymous" name="anonymous" className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label className="formlabel" htmlFor="anonymous">Reserve anonymously?</label>
                </div>

                {/* Display General Form Errors */}
                {error && (
                    <div className="text-red-600 bg-red-100 p-2 rounded border border-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    className="formbutton mt-4 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={!selectedRoom || !selectedDay || !selectedTime || !seats.some(s => s.selected)}
                >
                    RESERVE NOW
                </button>
            </form>
        </div>
    );
}