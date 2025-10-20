import { body } from "express-validator";
import UserModel from "../models/user_model.js";

export const signUpSchema = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("has to be valid Email"),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("has to have at least 6 characters"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .custom(async (value) => {
            const isUser = await UserModel.findOne({ username: value });
            if (isUser) {
                return Promise.reject("Username already taken");
            }
        }),
];