// import { useAuth } from '../../AuthProvider.jsx';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// import { IconEdit, IconTrash } from '@tabler/icons-react'

// // document.title = 'BookLabs Reservation';

// export default function Reservations() {
//     const navigate = useNavigate();
    
//     const [reservations, setReservations] = useState([]);
//     const [reservationVisuals, setReservationVisuals] = useState([]);

//     const header = [];

//     const columnHeader = [
//         {label: "User", accessor: "user"},
//         {label: "Room", accessor: "room"},
//         {label: "Seat", accessor: "seat"}, 
//         {label: "Reservation Date", accessor: "reserveDate"},
//         {label: "Timeslot", accessor: "timeslot"},
//         {label: "Timestamp", accessor: "timestamp"},
//         {label: "", accessor:"edit"},
//         {label: "", accessor:"cancel"}];

//     const getReservations = (() => {
//         //TODO: fetch reservation data

//         var tempReservations = [];
//         let currDate = new Date(Date.now())
//         let timestamp = currDate.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'}) + " " + currDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        
//         tempReservations.push({user:"john@dlsu.edu.ph", room: "G-306A", seat: "06", timestamp:  timestamp, reserveDate: "February 6, 2025", timeslot: ["16:30 - 17:00, 17:00 - 17:30"]})
//         tempReservations.push({user:"jane@dlsu.edu.ph", room: "G-306B", seat: "06", timestamp:  timestamp, reserveDate: "February 7, 2025", timeslot: ["07:00 - 07:30"]})
//         tempReservations.push({user:"mary@dlsu.edu.ph", room: "G-308", seat: "01", timestamp:  timestamp, reserveDate: "February 8, 2025", timeslot: ["12:00 - 12:30, 17:00 - 17:30"]})
//         tempReservations.push({user:"juan@dlsu.edu.ph", room: "G-306B", seat: "04", timestamp:  timestamp, reserveDate: "February 8, 2025", timeslot: ["13:00 - 13:30"]})
//         tempReservations.push({user:"jane@dlsu.edu.ph", room: "G-308", seat: "04", timestamp:  timestamp, reserveDate: "February 10, 2025", timeslot: ["08:00 - 08:30, 08:30 - 09:00"]})

//         setReservations(tempReservations);
//     });

//     for (let i = 0; i < columnHeader.length; i++) {
//         header.push(
//             <th key={columnHeader[i].accessor}
//                 className={`font-semibold py-1 px-2`}>
//                 {columnHeader[i].label}
//             </th>
//         );
//     }

//     const getReservationVisuals = (() => {
//         var visuals = [];

//         for (let i = 0; i < reservations.length; i++) {
//             var rowData = [];

//             for (var column of columnHeader) {
//                 if (reservations[i].hasOwnProperty(column.accessor)) {
//                     rowData.push(
//                         <td key={column.accessor + "" + i}
//                             className='py-1 px-2'>
//                             {reservations[i][column.accessor]}
//                         </td>
//                     );
//                 }
//             }

//             //TODO: implement logic to check if time is within 10 minutes of reservation
//             var deleteable = i < 2;

//             visuals.push(
//                 <tr key={"data" + i} 
//                     className={`odd:bg-white even:bg-fieldgray hover:bg-bgpink`}>
//                     {rowData}

//                     <td>
//                         <IconEdit stroke={2} className='cursor-pointer' onClick={(e) => {navigate("/edit/abc")}}/>
//                     </td>
//                     {
//                         deleteable ? 
//                             <td>
//                                 <IconTrash stroke={2} color='#cc5f5f' className='cursor-pointer' onClick={(e) => {if (confirm("Do you want to delete this reservation?")) console.log("deleted reservation")}}/>
//                             </td>
//                         : <td></td>
//                     }
//                 </tr>
//             )
//         }

//         setReservationVisuals(visuals);
//     });

//     useEffect(() => {
//         getReservations();
//     }, []);

//     useEffect(() => {
//         getReservationVisuals();
//     }, [reservations]);

//     return (
//         <div className="flex flex-col border-2 border-bgblue mt-4 p-4 rounded-lg">
//             <div className='font-bold text-[24px] text-fontgray pb-1.5'>
//                 Reservations
//             </div>
//             <table className={`w-3/5 table-auto my-3 rounded-sm bg-white border-solid border-2 border-bgblue text-left text-fontgray border-separate border-spacing-0`}>
//                 <thead className="shadow shadow-sm">
//                     <tr className={`bg-bgblue`}>
//                         {header}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reservationVisuals}
//                 </tbody>
//             </table>
//         </div>
        
//     );
// }

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthProvider.jsx';
import { IconTrash } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import { io } from 'socket.io-client';

export default function Reservations() {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
        
        // 🔥 Connect to WebSocket server
        const socket = io('http://localhost:5000');

        // 🔥 Listen for reservation updates
        socket.on('updateReservations', (data) => {
            console.log('Received real-time update:', data);
            fetchReservations(); // Refresh reservations when updated
        });

        return () => socket.disconnect(); // Cleanup on unmount
    }, []);

    const fetchReservations = async () => {
        try {
            const apiEndpoint = auth.user.role === 'technician' ? '/api/reservations/technician' : '/api/reservations/user';
            const response = await axios.get(`http://localhost:5000${apiEndpoint}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleDelete = async (reservationId) => {
        if (!window.confirm('Are you sure you want to delete this reservation?')) return;
        try {
            const apiEndpoint = auth.user.role === 'technician' ? '/api/remove-reservation/technician' : '/api/remove-reservation/user';
            await axios.delete(`http://localhost:5000${apiEndpoint}/${reservationId}`);
            enqueueSnackbar('Reservation removed successfully.', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error removing reservation.', { variant: 'error' });
            console.error('Delete error:', error);
        }
    };

    return (
        <div className='flex flex-col border-2 border-bgblue mt-4 p-4 rounded-lg'>
            <h2 className='font-bold text-2xl'>Reservations</h2>
            <table className='w-full table-auto my-3 rounded-sm bg-white border-solid border-2 border-bgblue text-left'>
                <thead>
                    <tr className='bg-bgblue'>
                        <th>User</th>
                        <th>Room</th>
                        <th>Seat</th>
                        <th>Reservation Date</th>
                        <th>Timeslot</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((res) => (
                        <tr key={res._id} className='odd:bg-white even:bg-fieldgray hover:bg-bgpink'>
                            <td>{res.userEmail}</td>  {/* ✅ Now displays user's email */}
                            <td>{res.labName}</td>   {/* ✅ Now displays lab name */}
                            <td>{res.seatNumber || 'N/A'}</td>
                            <td>{new Date(res.startTime).toLocaleDateString()}</td>
                            <td>{new Date(res.startTime).toLocaleTimeString()} - {new Date(res.endTime).toLocaleTimeString()}</td>
                            <td>
                                {auth.user.role === 'technician' && (
                                    <IconTrash stroke={2} color='#cc5f5f' className='cursor-pointer' onClick={() => handleDelete(res._id)} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
