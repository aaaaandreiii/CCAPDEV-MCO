import express from "express";
import { db } from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const userId = req.query.userId;
      let matchStage = {};
  
      if (userId) {
        matchStage = { userID: userId }; 
      }
  
      const reservations = await db.collection("Reservations").aggregate([
        { $match: matchStage }, // applies filter if userId is present in link
        {
          $lookup: {
            from: "UserInformation",
            localField: "userID",
            foreignField: "userID",
            as: "userDetails"
          }
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            "userDetails.firstName": 1,
            "userDetails.lastName": 1,
            "labID": 1,
            "startTime": 1,
            "endTime": 1,
            "seatNumber": 1,
            "createdAt": 1,
            "isAnonymous": 1,
            "updatedAt": 1
          }
        }
      ]).toArray();
  
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

  router.get("/:id", async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid userID format" });
        }

        const reservations = await db.collection("Reservations").aggregate([
            { 
                $match: { userID: new ObjectId(userID) } // Convert to ObjectId
            },
            {
                $lookup: {
                    from: "UserInformation",
                    localField: "userID",
                    foreignField: "userID", // Match against _id (ObjectId) in UserInformation
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    "userDetails.firstName": 1,
                    "userDetails.lastName": 1,
                    "labID": 1,
                    "startTime": 1,
                    "endTime": 1,
                    "seatNumber": 1,
                    "createdAt": 1,
                    "isAnonymous": 1,
                    "updatedAt": 1
                }
            }
        ]).toArray();

        res.json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


  export default router;
  