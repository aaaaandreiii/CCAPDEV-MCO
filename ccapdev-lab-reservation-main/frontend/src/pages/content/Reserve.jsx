import { useAuth } from '../../AuthProvider.jsx';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSnackbar } from "notistack";
import axios from 'axios';

export default function Reserve() {
    const API_BASE_URL = "http://localhost:5000/api";
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();
    const [isLab, setIsLab] = useState(false);
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [times, setTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);
    const [seats, setSeats] = useState([]);
    const [seatVisuals, setSeatVisuals] = useState([]);
    const generateDays = () => {
        let arr = [];
        let today = new Date();
        for (let i = 0; i < 7; i++) { // Next 7 days
            let day = new Date(today);
            day.setDate(today.getDate() + i);
            arr.push({ label: day.toDateString(), value: day.toISOString().split("T")[0] });
        }
        setDays(arr);
        setSelectedDay(arr[0] || null);
    };
    
    useEffect(() => {
        generateDays(); // Generate days on component load
    }, []);
    

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/labs');
            const roomOptions = response.data.map(lab => ({ label: lab.name, value: lab._id }));
            setRooms(roomOptions);
            setSelectedRoom(roomOptions[0] || null);
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    };

    useEffect(() => {
        if (selectedRoom && selectedTime.length > 0) {
            fetchSeats();
        }
    }, [selectedRoom, selectedTime]);    

    useEffect(() => {
        if (selectedRoom && selectedDay) {
            console.log("🔍 Fetching available slots for room and day...");
            fetchAvailableSlots();  // Fetch available slots if room and day are selected
        }
    }, [selectedRoom, selectedDay]);
    
    const fetchAvailableSlots = async () => {
        if (!selectedRoom || !selectedDay) return;
    
        console.log("🔍 Fetching available slots...");
        try {
            const response = await axios.get(`http://localhost:5000/api/available-slots/${selectedRoom.value}/${selectedDay.value}`);
            console.log("✅ Available slots response:", response.data);
    
            const formattedSlots = response.data.map(slot => ({
                label: `${new Date(slot.startTime).toLocaleTimeString()} - ${new Date(slot.endTime).toLocaleTimeString()}`,
                value: slot.startTime
            }));
    
            console.log("Formatted slots:", formattedSlots);
    
            setTimes(formattedSlots);
    
            if (formattedSlots.length > 0 && !selectedTime) {
                setSelectedTime(formattedSlots[0]);  // Set selected time if not already set
            }
        } catch (error) {
            console.error('❌ Error fetching available slots:', error);
        }
    };
    
    
    useEffect(() => {
        if (times.length > 0) {
            setSelectedTime(times[0]); //dapat auto-select first available time slot
        }
    }, [times]);
    

    useEffect(() => {
        console.log("🔍 Checking conditions for fetching seats:");
        console.log("selectedRoom:", selectedRoom);
        console.log("selectedTime:", selectedTime);

        if (selectedRoom && selectedTime) {
            fetchSeats();
        }
    }, [selectedRoom, selectedTime]);
    
    
    const fetchSeats = async () => {
        if (!selectedRoom?.value || selectedTime.length === 0) {
            console.log("⏳ Waiting for room & time selection...");
            return;
        }
    
        try {
            const timeValues = selectedTime.map(time => time.value); // Extract values from array
            console.log("Fetching seats for times:", timeValues);
            
            const response = await axios.get(`${API_BASE_URL}/seats/${selectedRoom.value}/${timeValues[0]}`);
            console.log("✅ Fetched seats:", response.data);
    
            if (!response.data.length) {
                setSeatVisuals([<p key="no-seats" className="text-red-500">No available seats</p>]);
            } else {
                setSeats(response.data);
                setSeatVisuals(response.data.map(seat => (
                    <button key={seat._id} onClick={() => handleSeatSelection(seat)} className="p-2 bg-blue-500 text-white">
                        Seat {seat.seatNumber}
                    </button>
                )));
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
        }
    };    

    const handleSeatSelection = (seat) => {
        setSeats(prevSeats =>
            prevSeats.map(s =>
                s._id === seat._id ? { ...s, selected: !s.selected } : s
            )
        );
    };    
    
    useEffect(() => {
        if (selectedRoom && selectedTime) {
            fetchSeats();
        }
    }, [selectedRoom, selectedTime]);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedSeat = seats.find(seat => seat.selected);
        
        if (!selectedSeat) {
            enqueueSnackbar('Please select a seat before submitting!', { variant: 'error' });
            return;
        }
    
        try {
            const reservationData = {
                userID: auth.user.id,
                labID: selectedRoom.value,
                startTime: selectedTime[0]?.value, // Handle multiple selections
                endTime: new Date(new Date(selectedTime[0]?.value).getTime() + 30 * 60000),
                seatNumber: selectedSeat.seatNumber,
                isAnonymous: e.target.anonymous.checked,
            };
    
            await axios.post("http://localhost:5000/api/reserve/user", reservationData);
            enqueueSnackbar('Successfully reserved!', { variant: 'success' });
        } catch (error) {
            console.error('Reservation error:', error);
            setError('Error making reservation.');
        }
    };
    

    return (
        <div className="flex flex-col">
            <div className='capitalize font-bold text-[24px] text-fontgray pb-1.5'>Reserve</div>
            <form onSubmit={handleSubmit}>
                <label className="formlabel required" htmlFor="room">Room</label>
                <Select className='w-[216px] mb-3' options={rooms} value={selectedRoom} onChange={setSelectedRoom} />

                <label className="formlabel required" htmlFor="day">Reservation Date</label>
                <Select className='w-[216px] mb-3' options={days} value={selectedDay} onChange={setSelectedDay} />

                <label className="formlabel required" htmlFor="timeslot">Time Slot</label>
                <Select className='w-[450px] mb-3' isMulti options={times} value={selectedTime} onChange={setSelectedTime} />

                <label className="formlabel required">Seats</label>
                <div className='flex flex-wrap gap-2 p-2 w-fit'>
                    {seatVisuals.length > 0 ? seatVisuals : <p className="text-red-500">No available seats</p>}
                </div>


                <label className="formlabel mr-3" htmlFor="anonymous">Reserve anonymously?</label>
                <input type="checkbox" id="anonymous" name="anonymous" />

                <div className="msgerror">{error}</div>
                <button className="formbutton mt-3" type="submit">RESERVE</button>
            </form>
        </div>
    );
}
