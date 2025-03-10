import { useAuth } from '../../AuthProvider.jsx';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { IconEdit, IconTrash, IconCheck } from '@tabler/icons-react'

import pfp1 from '../../assets/pfp1.jpg';
import pfp2 from '../../assets/pfp2.jpg';
import pfp3 from '../../assets/pfp3.jpg';

// document.title = 'BookLabs Profile';

export default function Profile() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [canEdit, setCanEdit] = useState(true);
    const [canDelete, setCanDelete] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const [reservations, setReservations] = useState([]);
    const [reservationVisuals, setReservationVisuals] = useState([]);

    const [pfpUrl, setPfpUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [reset, setReset] = useState(Date.now());

    const { id } = useParams();

    const [user, setUser] = useState({username: "hatdog"});

    const header = [];

    const columnHeader = [
        {label: "Room", accessor: "room"},
        {label: "Seat", accessor: "seat"}, 
        {label: "Reservation Date", accessor: "reserveDate"},
        {label: "Timeslot", accessor: "timeslot"},
        {label: "Timestamp", accessor: "timestamp"},
        {label: "", accessor:"edit"},
        {label: "", accessor:"cancel"}];

    const getReservations = (() => {
        //TODO: fetch reservation data

        var tempReservations = [];
        let currDate = new Date(Date.now())
            let timestamp = currDate.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'}) + " " + currDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        if (id == "student") {
            tempReservations.push({room: "G-306A", seat: "06", timestamp:  timestamp, reserveDate: "February 6, 2025", timeslot: ["16:30 - 17:00, 17:00 - 17:30"]})
            tempReservations.push({room: "G-306B", seat: "06", timestamp:  timestamp, reserveDate: "February 7, 2025", timeslot: ["07:00 - 07:30"]})
        } else if (id == "friend") {
            tempReservations.push({room: "G-308", seat: "01", timestamp:  timestamp, reserveDate: "February 8, 2025", timeslot: ["12:00 - 12:30, 17:00 - 17:30"]})
            tempReservations.push({room: "G-306B", seat: "04", timestamp:  timestamp, reserveDate: "February 8, 2025", timeslot: ["13:00 - 13:30"]})
            tempReservations.push({room: "G-308", seat: "04", timestamp:  timestamp, reserveDate: "February 10, 2025", timeslot: ["08:00 - 08:30, 08:30 - 09:00"]})
        }
        setReservations(tempReservations);
    });

    for (let i = 0; i < columnHeader.length; i++) {
        header.push(
            <th key={columnHeader[i].accessor}
                className={`font-semibold py-1 px-2`}>
                {columnHeader[i].label}
            </th>
        );
    }

    const getReservationVisuals = (() => {
        var visuals = [];

        for (let i = 0; i < reservations.length; i++) {
            var rowData = [];

            for (var column of columnHeader) {
                if (reservations[i].hasOwnProperty(column.accessor)) {
                    rowData.push(
                        <td key={column.accessor + "" + i}
                            className='py-1 px-2'>
                            {reservations[i][column.accessor]}
                        </td>
                    );
                }
            }

            visuals.push(
                <tr key={"data" + i} 
                    className={`odd:bg-white even:bg-fieldgray hover:bg-bgpink`}>
                    {rowData}
                    {
                        canEdit ? 
                        <td>
                            <IconEdit stroke={2} className='cursor-pointer' onClick={(e) => {navigate("/edit/abc")}}/>
                        </td>
                        : <td></td>
                    }
                    {
                        canEdit && id=="student" ? 
                            <td>
                                <IconTrash stroke={2} color='#cc5f5f' className='cursor-pointer' onClick={(e) => {if (confirm("Do you want to delete this reservation?")) console.log("deleted reservation")}}/>
                            </td>
                        : <td></td>
                    }
                </tr>
            )
        }

        setReservationVisuals(visuals);
    });

    useEffect(() => {
        // TODO: query backend for user data with id

        // TODO: replace with actual logic
        var tempUser;
        if (id == "student") {
            tempUser = {type:"student", username: "Juan Carlos", description:"i like watching anime :3"}
            setPfpUrl(pfp1)
            setCanEdit(true);
            setCanDelete(true);
        } else if (id == "friend") {
            tempUser = {type:"student", username: "Mary Jane Dela Cruz", description:"Let's be friends!"}
            setPfpUrl(pfp2)
            setCanEdit(auth.user == "lab");
        } else if (id == "lab") {
            tempUser = {type:"lab", username: "LeBron James", description: "LEEEEEBRRROOOOOOOOON JAAAAAAMES"}
            setPfpUrl(pfp3)
            setCanEdit(true);
        }
        
        setUser(tempUser);
    }, [id]);

    useEffect(() => {
        getReservations();
    }, [user]);

    useEffect(() => {
        getReservationVisuals();
    }, [reservations]);

    return (
        <>
            <div className="flex flex-col border-2 border-bgblue p-4 rounded-lg">
                <div className="flex flex-row">
                    {
                        !editMode ? 
                            <>
                                <img
                                    src={pfpUrl}
                                    className="w-[150px]"
                                    alt="Profile Picture"
                                />

                                <div className="flex flex-col ml-12 w-full">
                                    <div className='text-[24px] text-fontgray pb-1.5'>
                                        Name: {user.username}
                                    </div>
                                    <div className='text-fontgray'>
                                        Description: {user.description}
                                    </div>
                                </div>

                                {
                                    canEdit && id=="student" ? 
                                        <div className='w-fit flex flex-row-reverse'>
                                            <IconEdit stroke={2} onClick={(e) => {setEditMode(!editMode)}}/>
                                        </div>
                                    : <></>
                                }

                                
                            </>
                        : 
                            <>
                                <div className="w-fit flex flex-col gap-2">
                                    <img
                                        src={selectedImage ? URL.createObjectURL(selectedImage) : pfpUrl}
                                        className="w-[150px]"
                                        alt="Profile Picture"
                                    />
                                    <label class="formbutton text-center">
                                        <input
                                            className='hidden'
                                            type="file"
                                            name="pfpUpload"
                                            key={reset}
                                            onChange={(event) => {
                                                console.log(event.target.files[0]);
                                                setSelectedImage(event.target.files[0]);
                                            }}
                                        />
                                        Upload
                                    </label>
                                    {
                                        selectedImage ? 
                                            <button className="formbutton" onClick={() => setSelectedImage(null)}>Reset</button>
                                        : <></>
                                    }
                                </div>
                                
                                <div className="flex flex-col ml-12 w-full">
                                    <div className='text-[24px] text-fontgray pb-1.5'>
                                        Name: {user.username}
                                    </div>
                                    <div className='text-fontgray'>
                                        <div>Description:</div>
                                        <textarea className="formlabel border-2 border-fontgray p-2 resize-none !outline-none"
                                            id="description" 
                                            name="description" 
                                            rows="5" 
                                            cols="100" 
                                            maxlength="300"
                                            defaultValue={user.description}>
                                        </textarea>
                                    </div>
                                </div>

                                <div className='w-fit flex flex-col justify-between'>
                                    <div className="flex flex-row-reverse">
                                        <IconCheck stroke={2} color='#70cc66' onClick={(e) => {setEditMode(!editMode)}}/>
                                    </div>
                                    {
                                        canDelete ? 
                                            <>
                                                <button className="formbutton bg-errorred"
                                                    onClick={(e) => {if (confirm("Do you want to delete your account?")) navigate("/login")}}>
                                                    Delete User
                                                </button>
                                            </> 
                                        : <></>
                                    }
                                </div>
                            </>
                    }
                </div>
            </div>
            {
                user.type == "student" ? 
                    <>
                        <div className="flex flex-col border-2 border-bgblue mt-4 p-4 rounded-lg">
                            <div className='font-bold text-[24px] text-fontgray pb-1.5'>
                                Reservations
                            </div>
                            <table className={`w-3/5 table-auto my-3 rounded-sm bg-white border-solid border-2 border-bgblue text-left text-fontgray border-separate border-spacing-0`}>
                                <thead className="shadow shadow-sm">
                                    <tr className={`bg-bgblue`}>
                                        {header}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservationVisuals}
                                </tbody>
                            </table>
                        </div>
                    </>
                : <></>
            }
            
        </>
        
    );
}