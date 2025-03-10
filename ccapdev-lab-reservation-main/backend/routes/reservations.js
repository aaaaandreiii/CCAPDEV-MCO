import express from "express";
import mongoose from "mongoose";
import Reservation from "../models/ReservationByUser.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate("userID", "firstName lastName")  // ✅ Mongoose .populate() replaces $lookup
            .populate("labID", "name")
            .exec();

        res.json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




//MongoDB implementation


// //gets all reservations
// router.get("/", async (req, res) => {
//     try {
//         const reservations = await Reservation.aggregate([
//             {
//                 $lookup: {
//                     from: "userinformations",
//                     localField: "userID",
//                     foreignField: "userID",
//                     as: "userDetails"
//                 }
//             },
//             { $unwind: "$userDetails" },
//             {
//                 $project: {
//                     "_id": 1,
//                     "userDetails.firstName": 1,
//                     "userDetails.lastName": 1,
//                     "labID": 1,
//                     "startTime": 1,
//                     "endTime": 1,
//                     "seatNumber": 1,
//                     "createdAt": 1,
//                     "isAnonymous": 1,
//                     "updatedAt": 1
//                 }
//             }
//         ]);

//         res.json(reservations);
//     } catch (error) {
//         console.error("Error fetching reservations:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// //gets reservations made by the logged-in user
// router.get("/:userID", async (req, res) => {
//     try {
//         const userId = req.params.userID;
//         console.log("Request parameters:", req.params);

//         let matchStage = {};

//         if (mongoose.Types.ObjectId.isValid(userId)) {
//             matchStage = { userID: new mongoose.Types.ObjectId(userId) };
//         } else {
//             matchStage = { userID: userId };
//         }

//         const reservations = await Reservation.aggregate([
//             { $match: matchStage },
//             {
//                 $lookup: {
//                     from: "Userinformation",
//                     localField: "userID",
//                     foreignField: "userID",
//                     as: "userDetails"
//                 }
//             },
//             { $unwind: "$userDetails" },
//             {
//                 $project: {
//                     "_id": 1,
//                     "userDetails.firstName": 1,
//                     "userDetails.lastName": 1,
//                     "labID": 1,
//                     "startTime": 1,
//                     "endTime": 1,
//                     "seatNumber": 1,
//                     "createdAt": 1,
//                     "isAnonymous": 1,
//                     "updatedAt": 1
//                 }
//             }
//         ]);

//         res.json(reservations);
//     } catch (error) {
//         console.error("Error fetching reservations:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// // gets reservation by reservation ID for editing
// router.get("/edit/:id", async (req, res) => {
//     try {
//         const reservationId = req.params.id;

//         if (!mongoose.Types.ObjectId.isValid(reservationId)) {
//             return res.status(400).json({ message: "Invalid reservation ID format" });
//         }

//         const reservation = await Reservation.aggregate([
//             { $match: { _id: new mongoose.Types.ObjectId(reservationId) } },
//             {
//                 $lookup: {
//                     from: "UserInformation",
//                     localField: "userID",
//                     foreignField: "_id",
//                     as: "userDetails"
//                 }
//             },
//             { $unwind: "$userDetails" },
//             {
//                 $project: {
//                     "_id": 1,
//                     "userDetails.firstName": 1,
//                     "userDetails.lastName": 1,
//                     "labID": 1,
//                     "startTime": 1,
//                     "endTime": 1,
//                     "seatNumber": 1,
//                     "createdAt": 1,
//                     "isAnonymous": 1,
//                     "updatedAt": 1
//                 }
//             }
//         ]);

//         if (reservation.length === 0) {
//             return res.status(404).json({ message: "Reservation not found" });
//         }

//         res.json(reservation[0]);
//     } catch (error) {
//         console.error("Error fetching reservation by ID:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// export default router;
