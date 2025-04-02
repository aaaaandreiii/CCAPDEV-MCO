function generateTimeSlots() {
    const slots = [];
    let startHour = 7;  // Start at 7:00 AM
    let endHour = 18;   // End at 6:00 PM

    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += 30) {
            let startTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            let endHourAdjusted = min === 30 ? hour + 1 : hour;
            let endMinAdjusted = min === 30 ? 0 : 30;
            let endTime = `${endHourAdjusted.toString().padStart(2, '0')}:${endMinAdjusted.toString().padStart(2, '0')}`;

            slots.push({ startTime, endTime });
        }
    }
    return slots;
}

module.exports = generateTimeSlots;