import { useEffect } from "react";
import { io } from "socket.io-client";

export const useWebSocket = (onUpdate) => {
    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("update-reservations", (data) => {
            onUpdate(data);
        });

        socket.on("reservation-deleted", (reservationId) => {
            onUpdate((prev) => prev.filter(res => res._id !== reservationId));
        });

        return () => socket.disconnect();
    }, [onUpdate]);
};
