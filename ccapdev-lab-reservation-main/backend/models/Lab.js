const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    description: { type: String, maxlength: 500 },
    location: { type: String, required: true },
    availability: [
        {
            day: { type: String, required: true },
            slots: [
                {
                    startTime: { type: Date, required: true },
                    endTime: { type: Date, required: true }
                }
            ]
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lab', LabSchema);