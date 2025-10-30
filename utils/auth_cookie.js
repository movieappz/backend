import jwt from "jsonwebtoken";

const EXPIRATION_ACCESTOKEN = "24h";

export const createTokenAndSetCookie = (user, res) => {
    if (!process.env.TOKEN_SECRET) {
        throw new Error("TOKEN_SECRET not configured");
    }

    const token = jwt.sign(
        {
            userName: user.username,
            userId: user._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: EXPIRATION_ACCESTOKEN,
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000 * 24,
        path: "/"
    });

    return token;
};