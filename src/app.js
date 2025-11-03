import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import connectToMongoose from "../utils/mongoose_connect.js"
import authRoutes from "./routes/auth_routes.js"
import favoritesRoutes from "./routes/favorites_routes.js"

dotenv.config();

const app = express()

const allowedOrigins = ["http://localhost:5173", "https://yourmoviez.vercel.app"];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin);
        return callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 204,
};


app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



let mongooseReady = false;
app.use(async (req, res, next) => {
    if (!mongooseReady) {
        const connected = await connectToMongoose();
        mongooseReady = Boolean(connected);
        if (!mongooseReady) {
            return res.status(503).json({ error: "Database unavailable" });
        }
        console.log("MongoDB connected successfully");
    }
    return next();
});

app.use("/auth", authRoutes);
app.use("/favorites", favoritesRoutes);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

export default app;