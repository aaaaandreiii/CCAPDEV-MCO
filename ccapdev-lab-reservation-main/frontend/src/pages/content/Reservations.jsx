import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthProvider.jsx";
import { IconTrash } from "@tabler/icons-react";
import { useSnackbar } from "notistack";
import API_BASE_URL from "../../config/config.js";
import { useSocket } from "../../context/SocketContext.jsx";

export default function Reservations() {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();
    const [reservations, setReservations] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        fetchReservations();

        if (socket) {
            socket.on("update-reservations", (data) => {
                console.log("🔄 Real-time update received:", data);
                fetchReservations();
            });

            socket.on("reservation-deleted", (reservationId) => {
                console.log("❌ Reservation deleted:", reservationId);
                setReservations((prev) => prev.filter((res) => res._id !== reservationId));
            });
        }

        return () => {
            if (socket) {
                socket.off("update-reservations");
                socket.off("reservation-deleted");
            }
        };
    }, [socket]);

    const fetchReservations = async () => {
        try {
            const endpoint = auth.user.role === "technician" ? "/reservations/technician" : "/reservations/user";
            const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    
            console.log("🔄 Reservations received:", response.data);
            setReservations(response.data);
            console.log("🔄 Reservations received:", JSON.stringify(response.data, null, 2));

        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };
    

    const handleDelete = async (reservationId) => {
        if (!window.confirm("Are you sure you want to delete this reservation?")) return;
        try {
            const endpoint = auth.user.role === "technician" ? "/remove-reservation/technician" : "/remove-reservation/user";
            await axios.delete(`${API_BASE_URL}${endpoint}/${reservationId}`);

            enqueueSnackbar("Reservation removed successfully.", { variant: "success" });

            //emit WebSocket event after deletion pls pls pls pls pls pls
            if (socket) {
                socket.emit("delete-reservation", reservationId);
            }

            setReservations((prev) => prev.filter((res) => res._id !== reservationId));
        } catch (error) {
            enqueueSnackbar("Error removing reservation.", { variant: "error" });
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="flex flex-col border-2 border-bgblue mt-4 p-4 rounded-lg">
            <h2 className="font-bold text-2xl">Reservations</h2>
            <table className="w-full table-auto my-3 rounded-sm bg-white border-solid border-2 border-bgblue text-left">
                <thead>
                    <tr className="bg-bgblue">
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
                        <tr key={res._id} className="odd:bg-white even:bg-fieldgray hover:bg-bgpink">
                            <td>{res.userEmail || "Anonymous"}</td>
                            <td>{res.labName}</td>
                            <td>{res.seatNumber || "N/A"}</td>
                            <td>{new Date(res.startTime).toLocaleDateString()}</td>
                            <td>
                                {new Date(res.startTime).toLocaleTimeString()} - {new Date(res.endTime).toLocaleTimeString()}
                            </td>
                            <td>
                                {auth.user.role === "technician" && (
                                    <IconTrash stroke={2} color="#cc5f5f" className="cursor-pointer" onClick={() => handleDelete(res._id)} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label>
                <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                Reserve Anonymously
            </label>
        </div>
    );
}
