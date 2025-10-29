import jwt from "jsonwebtoken";
import UserModel from "../models/user_model.js";

export const currentUserController = async (req, res) => {
    try {
        const token = req.cookies.token;

        console.log("Cookie received:", token);

        if (!token) {
            return res.status(401).json({
                errors: [{
                    path: 'auth',
                    message: "No token provided"
                }]
            });
        }

        if (!process.env.TOKEN_SECRET) {
            return res.status(500).json({
                errors: [{
                    path: 'general',
                    message: "Server configuration error"
                }]
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Decoded token:", decoded);

        const user = await UserModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                errors: [{
                    path: 'user',
                    message: "User not found"
                }]
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("currentUser error:", error);
        return res.status(401).json({
            errors: [{
                path: 'auth',
                message: "Invalid or expired token"
            }]
        });
    }
};