import UserModel from "../models/user_model.js";


export const userProfil = async (req, res) => {
    try {
        if (!req.body.username) {
            return res.status(400).json({ error: "username missing" });
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { username: req.body.username.toLowerCase().replace(/\s+/g, '') },
            { ...req.body, username: req.body.username.toLowerCase().replace(/\s+/g, '') },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(201).json({ success: true, updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
