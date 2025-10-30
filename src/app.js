import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import connectToMongoose from "../utils/mongoose_connect.js"
import authRoutes from "./routes/auth_routes.js"
import favoritesRoutes from "./routes/favorites_routes.js"

dotenv.config();

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://yourmoviez.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Erlaube fehlende Origin (z.B. Server-to-Server, Healthchecks)
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin);
        return callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 204,
};

// Setze dynamisch ACAO/ACAC; Vary schützt Caches
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
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/favorites", favoritesRoutes);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// In Serverless-Umgebungen (z.B. Vercel) darf nicht aktiv gelauscht werden.
// Wir verbinden die DB lazily beim ersten Request.
let mongooseReady = false;
app.use(async (req, res, next) => {
    if (!mongooseReady) {
        const connected = await connectToMongoose();
        mongooseReady = Boolean(connected);
    }
    return next();
});

export default app;