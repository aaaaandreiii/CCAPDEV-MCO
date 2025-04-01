exports.getAvailableSlots = async (req, res) => {
    try {
      const { labID, date, startTime } = req.query; // Ensure startTime is defined
      if (!startTime) return res.status(400).json({ message: "Missing startTime" });
      const endTime = calculateEndTime(startTime);
      const availableSlots = await checkSlots(labID, date, startTime, endTime);
      res.json(availableSlots);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };