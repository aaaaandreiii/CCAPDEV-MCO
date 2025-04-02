const mongoose = require('mongoose');
const Lab = require('../models/Lab');

exports.getAllLabs = async (req, res) => {
    try {
        console.log("📡 Fetching all labs from database...");
        const labs = await Lab.find();
        console.log("✅ Labs found:", labs);
        res.json(labs);
    } catch (error) {
        console.error("❌ Error fetching labs:", error.message);
        res.status(500).json({ 
            error: "Internal server error", 
            details: error.message 
        });
    }
};


exports.getLabById = async (req, res) => {
    const { labID } = req.params;

    console.log("Received labID:", labID);

    if (!mongoose.Types.ObjectId.isValid(labID)) {
        return res.status(400).json({ error: "Invalid lab ID format" });
    }    

    try {
        const lab = await Lab.findById(labID);
        if (!lab) return res.status(404).json({ error: "Lab not found" });

        res.json(lab);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};




// const mongoose = require('mongoose'); 
// const Lab = require('../models/Lab');

// //get all labs


// //get a specific lab by ID
// exports.getLabById = async (req, res) => {
//     const { labID } = req.params;

//     console.log("Received labID:", labID);

//     if (!mongoose.Types.ObjectId.isValid(labID)) {
//         console.error("Invalid labID received:", labID);
//         return res.status(400).json({ error: "Invalid lab ID format" });
//     }

//     // if (!labID.match(/^[0-9a-fA-F]{24}$/)) {
//     //     return res.status(400).json({ error: "Invalid lab ID format" });
//     // }

//     try {
//         const lab = await Lab.findById(labID);
//         if (!lab) return res.status(404).json({ error: "Lab not found" });

//         res.json(lab);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };