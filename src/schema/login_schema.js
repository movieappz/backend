import { body } from "express-validator";

export const loginSchema = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("has to be valid Email"),

    body("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("has to have at least 5 characters"),
];