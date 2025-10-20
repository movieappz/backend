import UserModel from "../models/user_model.js";
import { createTokenAndSetCookie } from "../../utils/auth_cookie.js";


// ! SignUP
export const SignUpController = async (req, res) => {
    try {
        const newUser = new UserModel({
            ...req.body,
            username: req.body.username.toLowerCase().replace(/\s+/g, ''),
            profileCompleted: false
        });
        await newUser.save();

        const token = createTokenAndSetCookie(newUser, res);

        return res.status(201).json({
            success: true,
            insertedData: newUser,
            existingUser: false,
            token: token
        });
    } catch (error) {
        console.error("Signup error details:", {
            code: error.code,
            keyPattern: error.keyPattern,
            name: error.name,
            message: error.message
        });

        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(409).json({
                    errors: [{
                        path: 'email',
                        message: "This Email already exist"
                    }]
                });
            }
            if (error.keyPattern.username) {
                return res.status(409).json({
                    errors: [{
                        path: 'username',
                        message: "This Username already exist"
                    }]
                });
            }
        }


        if (error.name === 'ValidationError') {
            console.error("Validation error detected");
            const errors = Object.keys(error.errors).map(key => ({
                path: key,
                message: error.errors[key].message
            }));
            return res.status(400).json({ errors });
        }

        return res.status(400).json({
            errors: [{
                path: 'general',
                message: error.message || "Something with Validation is wrong"
            }]
        });
    }
};