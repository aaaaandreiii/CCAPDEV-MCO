module.exports.validateProfileUpdate = (req, res, next) => {
    const { description } = req.body;
    if (description && description.length > 300) {
        return res.status(400).json({ message: "Description exceeds the character limit" });
    }
    next();
};