
import { useAuth } from '../../AuthProvider.jsx';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSnackbar } from "notistack";

export default function Reserve() {
    const { enqueueSnackbar } = useSnackbar();

    const auth = useAuth();
    const [isLab, setIsLab] = useState(false);

    const [error, setError] = useState("");
    const rooms = [{label: "G306-A", value: "G306-A"}, {label: "G306-B", value: "G306-B"}, {label: "G308", value: "G308"}];

    const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
    const [today, setToday] = useState(new Date());
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [times, setTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);

    const [seats, setSeats] = useState([]);
    const [seatVisuals, setSeatVisuals] = useState([]);

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    const getDays = (() => {
        let arr = []
        var date = new Date();
        for (let i = 0; i < 7; i++) {
            let day = date.addDays(i);
            arr.push({label: day.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric',}), value: day});
        }
        setSelectedDay(arr[0]);
        return arr;
    });

    const getTimes = (() => {
        const createTimeslots = ((startTime, endTime, intervalMinutes) => {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
          
            const start = new Date();
            start.setHours(startHour, startMinute, 0, 0); // Set start time
          
            const end = new Date();
            end.setHours(endHour, endMinute, 0, 0);   // Set end time
          
            const timeslots = [];
            let currentTime = new Date(start); // Start from the beginning
          
            while (currentTime < end) {
              const nextTime = new Date(currentTime.getTime() + intervalMinutes * 60000); // Add interval in milliseconds
              const formattedTimeslot = `${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${nextTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
              timeslots.push(formattedTimeslot);
              currentTime = nextTime;
            }
          
            return timeslots;
          });
          
          const filterPastTimeslots = ((timeslots) => {
            const now = new Date();
            return timeslots.filter(timeslot => {
              const [startTimeStr] = timeslot.split('-');
              const [hour, minute] = startTimeStr.split(':').map(Number);
              const startTime = new Date();
              startTime.setHours(hour, minute, 0, 0);
              return startTime > now;
            });
          });
          
          var allTimeslots = createTimeslots("07:00", "24:00", 30);

          if (selectedDay != null && selectedDay.value.getDate() == today.getDate()) {
            allTimeslots = filterPastTimeslots(allTimeslots);
          }
          
          var options = [];

          for (var timeslot of allTimeslots) {
            options.push({label:timeslot, value:timeslot});
          }

          setTimes(options);
    });

    const getSeats = (async () => {
        //TODO: query server and check availability of seats

        //TODO: replace with actual data
        var names = ["juan@dlsu.edu.ph", "anonymous", "jane@dlsu.edu.ph", "mary@dlsu.edu.ph"]

        if (seats.length == 0) {
            var lab = []
            for (let i = 1; i <= 10; i++) {
                let available = i > names.length;
                let reservedTo = ""
                if (names[i-1]) {
                    reservedTo = names[i-1];
                }
                lab.push({seat: i.toString().padStart(2,"0"), available: available, selected: false, reservedTo:reservedTo});
            }

            setSeats(lab);
        } else {
            setSeats([...seats]);
        }
    });

    const getSeatVisuals = (() => {
        var labVisuals = [];

        for (let i = 0; i < seats.length; i++) {
            labVisuals.push(
                <div className={`w-80 h-8 px-4 py-1 ${seats[i].available ? `bg-bgblue` : `bg-fieldgray`} font-sans text-fontgray font-regular text-md`}
                    key={i}
                    id={i}
                    onClick={(e) => {
                        let index = e.target.id;

                        for (let i = 0; i < seats.length; i++) {
                            if (seats[i].available) {
                                if (seats[i].selected && i != index) {
                                    seats[i].selected = false;
                                } else if (i == index) {
                                    seats[i].selected = !seats[i].selected;
                                }
                            }
                            setSeats([...seats])
                        }
                    }}>
                    {(i+1).toString().padStart(2,"0")}
                    {seats[i].available ? "" : " : "}
                    {seats[i].reservedTo && seats[i].reservedTo != "anonymous" ? 
                        <Link to={'/profile/friend'}>{seats[i].reservedTo}</Link> 
                        : seats[i].reservedTo == "anonymous" ? "anonymous" : ""}
                    {seats[i].selected ? " : SELECTED SEAT" : ""}
                </div>
            )
        }

        setSeatVisuals(labVisuals);
    });

    useEffect(() => {
        //console.log(seats)
        getSeatVisuals();
    }, [seats, selectedRoom, selectedDay, selectedTime])

    useEffect(() => {
        setIsLab(auth.user == "lab");

        getSeats();

        const timer = setInterval(() => {
            setToday(new Date());
            getSeats();
        }, 60 * 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        setDays(getDays());
    }, [today]);

    useEffect(() => {
        setSelectedTime([]);
        getTimes();
    }, [selectedDay]);

    const handleSubmit = ((e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        var obj = Object.fromEntries(Array.from(formData.keys()).map(key => [
            key, formData.getAll(key).length > 1 ? 
              formData.getAll(key) : formData.get(key)
          ])
        );
        
        var valid = true;

        try {
            obj.selectedSeat = seats.find((seat) => {
                return seat.selected
            }).seat; 
        } catch {
            valid = false;
        }

        console.log(obj);

        // check if any fields in the form have been left blank
        for (let field in obj) {
            if (obj[field].length == 0) {
                valid = false;
                break;
            }
        }

        if (valid) {
            obj.day = new Date(obj.day).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric',});
            if (typeof obj.timeslot == "string") {
                obj.timeslot = [obj.timeslot]
            }
            setError("");
            submitData(obj);
        } else {
            setError("Required fields cannot be left blank.");
        }
    });

    const submitData = (async (formData) => {
        console.log(formData);

        //TODO: send formdata to server

        //TODO: check server response
        //if ok
        setError("");
        enqueueSnackbar("Successfully reserved!", {variant:'success', preventDuplicate:true});
    });

    return (
        <div className="flex flex-col">
            <div className='capitalize font-bold text-[24px] text-fontgray pb-1.5'>
                Reserve
            </div>
            <form onSubmit={handleSubmit}>
                <label 
                    className="formlabel required"
                    htmlFor="room">
                        Room
                </label>
                <Select 
                    className='w-[216px] mb-3'
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            background: '#f4f4f4',
                            border: 0,
                            boxShadow: 'none',}),
                    }}
                    id="room" 
                    name="room" 
                    options={rooms} 
                    value={selectedRoom}
                    onChange={(e) => {setSelectedRoom(e)}}/>

                <label 
                    className="formlabel required"
                    htmlFor="day">
                        Reservation Date
                </label>
                <Select 
                    className='w-[216px] mb-3'
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            background: '#f4f4f4',
                            border: 0,
                            boxShadow: 'none',}),
                    }}
                    id="day" 
                    name="day" 
                    options={days} 
                    value={selectedDay}
                    onChange={(e) => {setSelectedDay(e)}}/>

                <label 
                    className="formlabel required"
                    htmlFor="timeslot">
                        Time Slot
                </label>
                <Select 
                    className='w-[450px] mb-3'
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            background: '#f4f4f4',
                            border: 0,
                            boxShadow: 'none',}),
                    }}
                    id="timeslot" 
                    name="timeslot" 
                    isMulti
                    options={times} 
                    value={selectedTime}
                    onChange={(e) => {setSelectedTime(e)}}/>

                {
                    isLab ? 
                        <>
                            <label 
                                className="formlabel required"
                                htmlFor="student">
                                    Student Email
                            </label>
                            <input 
                                type="email"
                                className='forminput'
                                id="student" 
                                name="student" 
                                required
                            />
                        </>
                    : <></>
                }

                <label 
                    className="formlabel required">
                        Seats
                </label>
                <div className='flex flex-col gap-2 p-2 w-fit'>
                    {seatVisuals}
                </div>

                <label 
                    className="formlabel mr-3"
                    htmlFor="anonymous">
                        Reserve anonymously?
                </label>
                <input 
                    type="checkbox"
                    id="anonymous" 
                    name="anonymous" 
                    />
                <div className="msgerror">
                    {error}
                </div>
                <button className="formbutton mt-3" type="submit">RESERVE</button>
            </form>
        </div>
    );
}