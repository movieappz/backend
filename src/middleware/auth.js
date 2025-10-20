import jwt from "jsonwebtoken";

export default async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = req.cookies.token;
        }

        if (!token) {
            return res.sendStatus(403);
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (decodedToken) {
            req.userId = decodedToken.userId;
            req.userName = decodedToken.userName;
        }
    } catch (error) {
        return res.sendStatus(403);
    }
    next();
};