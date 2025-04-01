const crypto = require("crypto");
const User = require("../models/User");

const secret = process.env.HASH_SECRET || "default_secret";

exports.hashId = (id) => {
    return crypto.createHmac("sha256", secret).update(id.toString()).digest("hex");
};

exports.verifyHashedId = async (hashedId) => {
    try { // find the user with the matching hashed ID
        const user = await User.findOne({ hashedId });
        return user ? user._id.toString() : null; //return the real actual user ID if found
    } catch (error) {
        console.error("Error verifying hashed ID:", error);
        return null;
    }
};
