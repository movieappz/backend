import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user_model.js";
import { createTokenAndSetCookie } from "../../utils/auth_cookie.js";


export const loginController = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            errors: [{
                path: 'general',
                message: "You have to use the correct Mail and Password"
            }]
        });
    }

    try {
        const loggingUser = await UserModel.findOne({ email });

        if (!loggingUser) {
            return res.status(401).json({
                errors: [{
                    path: 'email',
                    message: "User not found"
                }]
            });
        }
        const isCorrectPassword = await bcrypt.compare(
            password,
            loggingUser.password
        );

        if (!isCorrectPassword) {
            return res.status(401).json({
                errors: [{
                    path: 'password',
                    message: "Password is wrong"
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

        const token = createTokenAndSetCookie(loggingUser, res);
        const isNewUser = (Date.now() - new Date(loggingUser.createdAt).getTime()) < 60000;

        res.send({
            logging: true,
            loggingUser,
            isNewUser: isNewUser,
            token: token
        });

    } catch (error) {
        return res.status(500).json({
            errors: [{
                path: 'general',
                message: "Something is wrong " + error.message
            }]
        });
    }
};
