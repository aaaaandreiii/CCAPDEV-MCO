import express from "express";
import Lab from "../models/Lab.js"; 

const router = express.Router();
router.get('/:labID', async (req, res) => {
    const { labID } = req.params;

    try {
        const lab = await Lab.findOne({ name: labID });
        if (!lab) return res.status(404).json({ error: "Lab not found" });

        res.json({ lab });
    } catch (error) {
        console.error("Error fetching lab:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.get('/', async (req, res) => {
    try {
        const labs = await Lab.find(); 
        if (!labs.length) return res.status(404).json({ error: "No labs found" });

        res.json({ labs });
    } catch (error) {
        console.error("Error fetching labs:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
