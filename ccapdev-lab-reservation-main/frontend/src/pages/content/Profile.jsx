// // import { useAuth } from '../../AuthProvider.jsx';
// // import { Link, useParams, useNavigate } from 'react-router-dom';
// // import { useState, useEffect } from 'react';
// // import { IconEdit, IconTrash, IconCheck } from '@tabler/icons-react';

// // import pfp1 from '../../assets/pfp1.jpg';
// // import pfp2 from '../../assets/pfp2.jpg';
// // import pfp3 from '../../assets/pfp3.jpg';

// // export default function Profile() {
// //     const navigate = useNavigate();
// //     const auth = useAuth();

// //     const [canEdit, setCanEdit] = useState(true);
// //     const [canDelete, setCanDelete] = useState(true);
// //     const [editMode, setEditMode] = useState(false);
    
// //     const [reservations, setReservations] = useState([]);
// //     const [reservationVisuals, setReservationVisuals] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [pfpUrl, setPfpUrl] = useState(pfp1);
// //     const [description, setDescription] = useState("");
// //     const [selectedImage, setSelectedImage] = useState(null);
// //     const [reset, setReset] = useState(Date.now());

// //     const { id } = useParams();

// //     const [user, setUser] = useState(() => {
// //         return JSON.parse(localStorage.getItem("user")) ?? null;
// //     });

// //     const columnHeader = [
// //         {label: "Name", accessor: "fullName"},
// //         {label: "Laboratory", accessor: "labID"},
// //         {label: "Seat", accessor: "seatNumber"}, 
// //         {label: "Reservation Date", accessor: "formattedReservationDate"},
// //         {label: "Timeslot", accessor: "timeSlot"},
// //         {label: "Time of Request", accessor: "formattedCreatedAt"},
// //         {label: "", accessor:"edit"},
// //         {label: "", accessor:"cancel"}
// //     ];



// //     const getReservationVisuals = () => {
// //         const reservationVisuals = reservations.map((reservation, index) => {
// //             return (
// //                 <tr key={index} className="odd:bg-white even:bg-fieldgray hover:bg-bgpink">
// //                     {columnHeader.map((column) =>
// //                         reservation.hasOwnProperty(column.accessor) ? (
// //                             <td key={`${column.accessor}-${index}`} className="py-1 px-2">
// //                                 {reservation[column.accessor]}
// //                             </td>
// //                         ) : null
// //                     )}
    
// //                     <td>
// //                         <IconEdit stroke={2} className="cursor-pointer" onClick={() => navigate(`/edit/${reservation._id}`)} />
// //                     </td>
// //                     <td>{/**TODO: change logic */}
// //                         <IconTrash stroke={2} color="#cc5f5f" className="cursor-pointer" onClick={() => navigate("/edit/${reservation._id}")} />
// //                     </td>
// //                     <td></td>
// //                 </tr>
// //             );
// //         });
    
// //         setReservationVisuals(reservationVisuals); 
// //     };    

// //     useEffect(() => {
// //         const fetchProfile = async () => {
// //             try {
// //                 const storedUser = JSON.parse(localStorage.getItem("user")); // Ensure consistency
// //                 if (!storedUser) throw new Error("User not found in localStorage");
        
// //                 const response = await fetch(`http://localhost:5000/api/profile/${storedUser.id}`);
// //                 if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
// //                 const data = await response.json();
// //                 setUser(data);
// //                 setPfpUrl(data.profilePicture || pfp1);
// //                 setCanEdit(data.role === "technician");
// //                 setCanDelete(data.role === "student"); 
// //             } catch (err) {
// //                 console.error("Error fetching user data:", err);
// //             }
// //         };        
        
// //         fetchProfile(); 
// //     }, [id]);

// //     useEffect(() => {
// //         const getReservations = async () => {
// //             try {
// //                 const user = JSON.parse(localStorage.getItem("user"));

// //                 if (!user) {
// //                     throw new Error("User not logged in");
// //                 }
// //                 console.log("user.otherID:", user.otherID);

// //                 const response = await fetch(`http://localhost:5000/api/reservations/${user.otherID}`, {
// //                     method: 'GET',
// //                 });
                
// //                 if (!response.ok) {
// //                     throw new Error(`HTTP error! Status: ${response.status}`);
// //                 }
// //                 const data = await response.json();

// //                 const formattedData = data.map((reservation) => ({
// //                     ...reservation,
// //                     fullName: `${reservation.userDetails.firstName} ${reservation.userDetails.lastName}`,
// //                     formattedReservationDate: new Date(reservation.startTime).toLocaleString("en-US", { 
// //                         month: "long",
// //                         day: "2-digit",
// //                         year: "numeric"
// //                     }),
// //                     timeSlot: `${new Date(reservation.startTime).toLocaleTimeString("en-US", { 
// //                         hour12: false, 
// //                         hour: "2-digit", 
// //                         minute: "2-digit",
// //                         timeZone: "Asia/Singapore"
// //                     })} - ${new Date(reservation.endTime).toLocaleTimeString("en-US", { 
// //                         hour12: false, 
// //                         hour: "2-digit", 
// //                         minute: "2-digit",
// //                         timeZone: "Asia/Singapore"
// //                     })}`,
// //                     formattedCreatedAt: new Date(reservation.createdAt).toLocaleString("en-US", {
// //                         year: "numeric",
// //                         month: "2-digit",
// //                         day: "2-digit",
// //                         hour12: false, 
// //                         hour: "2-digit", 
// //                         minute: "2-digit",
// //                         timeZone: "Asia/Singapore"
// //                     })
// //                 }));

// //                 setReservations(formattedData);
// //             } catch (err) {
// //                 console.error("Error fetching reservations:", err);
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         getReservations(); // Fetch reservations for the logged-in user
// //     }, [auth.user]);

// //     useEffect(() => {
// //         getReservationVisuals();
// //     }, [reservations]);
    
// //     const handleSave = async () => {
// //         try {
// //             const storedUser = JSON.parse(localStorage.getItem("user")); // Ensure consistency
// //             if (!storedUser) throw new Error("User not found in localStorage");
    
// //             const formData = new FormData();
// //             formData.append("description", description);
// //             if (selectedImage) {
// //                 formData.append("profilePicture", selectedImage);
// //             } else {
// //                 formData.append("profilePicture", pfpUrl);
// //             }
    
// //             const response = await fetch(`http://localhost:5000/api/profile/${storedUser.id}`, {
// //                 method: "POST",
// //                 body: formData,
// //             });
    
// //             if (!response.ok) {
// //                 const errorMessage = await response.text();
// //                 throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
// //             }
    
// //             const updatedUser = await response.json();
// //             setUser(updatedUser);
// //             setPfpUrl(updatedUser.profilePicture || pfp1);
// //             setEditMode(false);
// //         } catch (error) {
// //             console.error("Error updating profile:", error);
// //             alert(`Failed to update profile: ${error.message}`);
// //         }
// //     };
    

// //     return (
// //         <>
// //             <div className="flex flex-col border-2 border-bgblue p-4 rounded-lg">
// //                 <div className="flex flex-row">
// //                     {
// //                         !editMode ? 
// //                             <>
// //                                 <img
// //                                     src={pfpUrl}
// //                                     className="w-[150px]"
// //                                     alt="Profile Picture"
// //                                 />

// //                                 <div className="flex flex-col ml-12 w-full">
// //                                     <div className='text-[24px] text-fontgray pb-1.5'>
// //                                         Name: {user.firstName + " " + user.lastName}
// //                                     </div>
// //                                     <div className='text-fontgray'>
// //                                         Description: {user.description}
// //                                     </div>
// //                                 </div>

// //                                 {
// //                                     (user.role === "technician" || user.role === "student") && 
// //                                         <div className='w-fit flex flex-row-reverse'>
// //                                             <IconEdit stroke={2} className="cursor-pointer" onClick={() => navigate(`/edit/${reservation._id}`)} />
// //                                         </div>
// //                                 }
// //                             </>
// //                         : 
// //                             <>
// //                                 <div className="w-fit flex flex-col gap-2">
// //                                     <img
// //                                         src={selectedImage ? URL.createObjectURL(selectedImage) : pfpUrl}
// //                                         className="w-[150px]"
// //                                         alt="Profile Picture"
// //                                     />
// //                                     <label className="formbutton text-center">
// //                                         <input
// //                                             className='hidden'
// //                                             type="file"
// //                                             name="pfpUpload"
// //                                             key={reset}
// //                                             onChange={(event) => {
// //                                                 console.log(event.target.files[0]);
// //                                                 setSelectedImage(event.target.files[0]);
// //                                             }}
// //                                         />
// //                                         Upload
// //                                     </label>
// //                                     {
// //                                         selectedImage && 
// //                                             <button className="formbutton" onClick={() => setSelectedImage(null)}>Reset</button>
// //                                     }
// //                                 </div>

// //                                 <div className="flex flex-col ml-12 w-full">
// //                                     <div className='text-[24px] text-fontgray pb-1.5'>
// //                                         Name: {user.firstName + " " + user.lastName}
// //                                     </div>
// //                                     <div className='text-fontgray'>
// //                                         <div>Description:</div>
// //                                         <textarea 
// //                                             className="formlabel border-2 border-fontgray p-2 resize-none !outline-none"
// //                                             id="description" 
// //                                             name="description" 
// //                                             rows="5" 
// //                                             cols="100" 
// //                                             maxLength="300"
// //                                             placeholder={user.description}
// //                                             value={description} 
// //                                             onChange={(e) => setDescription(e.target.value)} 
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className='w-fit flex flex-col justify-between'>
// //                                     <div className="flex flex-row-reverse">
// //                                     <IconCheck stroke={2} color='#70cc66' onClick={(e) => { e.preventDefault(); handleSave(); }} />
// //                                     </div>
// //                                     {
// //                                         canDelete && 
// //                                             <button className="formbutton bg-errorred"
// //                                                 onClick={() => {if (confirm("Do you want to delete your account?")) navigate("/login")}}>
// //                                                 Delete User
// //                                             </button>
// //                                     }
// //                                 </div>
// //                             </>
// //                     }
// //                 </div>
// //                 {/* Student view - includes their reservations  */}
// //                 {user.role === "student" && (
// //                 <div className="mt-4">
// //                     <table className="table-auto w-full">
// //                         <thead className="shadow shadow-sm">
// //                             <tr className="bg-bgblue">
// //                                 {columnHeader.map((column, i) => (
// //                                     <th key={i} className="text-left font-semibold py-2 px-4">{column.label}</th>
// //                                 ))}
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {reservationVisuals}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             )}
// //             </div>
// //         </>
// //     );
// // }


// import { useAuth } from '../../AuthProvider.jsx';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { IconEdit, IconTrash, IconCheck } from '@tabler/icons-react';
// import { useWebSocket } from "../../hooks/useWebSocket";

// import pfp1 from '../../assets/pfp1.jpg';
// import pfp2 from '../../assets/pfp2.jpg';
// import pfp3 from '../../assets/pfp3.jpg';
// import API_BASE_URL from "../../config";

// useWebSocket(setReservations);

// const response = await fetch(`${API_BASE_URL}/reservations/${user.otherID}`);

// export default function Profile() {
//     const navigate = useNavigate();
//     const auth = useAuth();

//     const [canEdit, setCanEdit] = useState(true);
//     const [canDelete, setCanDelete] = useState(true);
//     const [editMode, setEditMode] = useState(false);
    
//     const [reservations, setReservations] = useState([]);
//     const [reservationVisuals, setReservationVisuals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [pfpUrl, setPfpUrl] = useState(pfp1);
//     const [description, setDescription] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [reset, setReset] = useState(Date.now());

//     const { id } = useParams();

//     const [user, setUser] = useState(() => {
//         return JSON.parse(localStorage.getItem("user")) ?? null;
//     });

//     const columnHeader = [
//         {label: "Name", accessor: "fullName"},
//         {label: "Laboratory", accessor: "labID"},
//         {label: "Seat", accessor: "seatNumber"}, 
//         {label: "Reservation Date", accessor: "formattedReservationDate"},
//         {label: "Timeslot", accessor: "timeSlot"},
//         {label: "Time of Request", accessor: "formattedCreatedAt"},
//         {label: "", accessor:"edit"},
//         {label: "", accessor:"cancel"}
//     ];

//     const getReservationVisuals = () => {
//         const reservationVisuals = reservations.map((reservation, index) => {
//             return (
//                 <tr key={index} className="odd:bg-white even:bg-fieldgray hover:bg-bgpink">
//                     {columnHeader.map((column) =>
//                         reservation.hasOwnProperty(column.accessor) ? (
//                             <td key={`${column.accessor}-${index}`} className="py-1 px-2">
//                                 {reservation[column.accessor]}
//                             </td>
//                         ) : null
//                     )}
    
//                     <td>
//                         <IconEdit stroke={2} className="cursor-pointer" onClick={() => navigate(`/edit/${reservation._id}`)} />
//                     </td>
//                     <td>
//                         <IconTrash stroke={2} color="#cc5f5f" className="cursor-pointer" onClick={() => navigate(`/delete/${reservation._id}`)}
//                         />
//                     </td>
//                     <td></td>
//                 </tr>
//             );
//         });
    
//         setReservationVisuals(reservationVisuals); 
//     };    

//     const handleDeleteAccount = async () => {
//         if (!confirm("Do you want to delete your account?")) return;
    
//         try {
//             const response = await fetch(`${API_BASE_URL}/users/${user.id}`, { method: "DELETE" });
//             if (!response.ok) throw new Error("Failed to delete account");
    
//             auth.logout();
//             navigate("/login");
//         } catch (error) {
//             alert("Error deleting account");
//         }
//     };
    

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const storedUser = JSON.parse(localStorage.getItem("user"));
//                 if (!storedUser) throw new Error("User not found in localStorage");
        
//                 const response = await fetch(`http://localhost:5000/api/profile/${storedUser.id}`);
//                 if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
//                 const data = await response.json();
//                 setUser(data);
//                 setPfpUrl(data.profilePicture || pfp1);
//                 setCanEdit(data.role === "technician");
//                 setCanDelete(data.role === "student"); 
//             } catch (err) {
//                 console.error("Error fetching user data:", err);
//             }
//         };        
        
//         fetchProfile(); 
//     }, [id]);

//     useEffect(() => {
//         const getReservations = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem("user"));
//                 if (!user) {
//                     throw new Error("User not logged in");
//                 }

//                 const response = await fetch(`http://localhost:5000/api/reservations/${user.otherID}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const data = await response.json();

//                 const formattedData = data.map((reservation) => ({
//                     ...reservation,
//                     fullName: `${reservation.userDetails.firstName} ${reservation.userDetails.lastName}`,
//                     formattedReservationDate: new Date(reservation.startTime).toLocaleDateString("en-US"),
//                     timeSlot: `${new Date(reservation.startTime).toLocaleTimeString("en-US")} - ${new Date(reservation.endTime).toLocaleTimeString("en-US")}`,
//                     formattedCreatedAt: new Date(reservation.createdAt).toLocaleString("en-US")
//                 }));

//                 setReservations(formattedData);
//             } catch (err) {
//                 console.error("Error fetching reservations:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getReservations();
//     }, [auth.user]);

//     useEffect(() => {
//         getReservationVisuals();
//     }, [reservations]);
// }


import { useAuth } from "../../AuthProvider.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import API_BASE_URL from "../../config/config.js";

import pfp1 from "../../assets/pfp1.jpg";

export default function Profile() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [reservations, setReservations] = useState([]);
    const [reservationVisuals, setReservationVisuals] = useState([]);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) ?? null);
    const { id } = useParams();

    useWebSocket(setReservations);  // ✅ Correct placement

    const fetchProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) throw new Error("User not found in localStorage");

            const response = await fetch(`${API_BASE_URL}/profile/${storedUser.id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setUser(data);
            setCanEdit(data.role === "technician");
            setCanDelete(data.role === "student");
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${user?.id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setReservations(data);
        } catch (err) {
            console.error("Error fetching reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Do you want to delete your account?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete account");

            auth.logout();
            navigate("/login");
        } catch (error) {
            alert("Error deleting account");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    useEffect(() => {
        fetchReservations();
    }, [user]);

    useEffect(() => {
        setReservationVisuals(
            reservations.map((reservation, index) => (
                <tr key={index} className="odd:bg-white even:bg-fieldgray hover:bg-bgpink">
                    <td>{reservation.fullName}</td>
                    <td>{reservation.labID}</td>
                    <td>{reservation.seatNumber}</td>
                    <td>{new Date(reservation.startTime).toLocaleDateString("en-US")}</td>
                    <td>{new Date(reservation.startTime).toLocaleTimeString("en-US")} - {new Date(reservation.endTime).toLocaleTimeString("en-US")}</td>
                    <td>
                        <IconEdit stroke={2} className="cursor-pointer" onClick={() => navigate(`/edit/${reservation._id}`)} />
                    </td>
                    <td>
                        <IconTrash stroke={2} color="#cc5f5f" className="cursor-pointer" onClick={() => navigate(`/delete/${reservation._id}`)} />
                    </td>
                </tr>
            ))
        );
    }, [reservations]);

    return (
        <div>
            <h1>{user?.name}'s Profile</h1>
            <button onClick={handleDeleteAccount} disabled={!canDelete}>
                Delete Account
            </button>
            <table>{reservationVisuals}</table>
        </div>
    );
}
