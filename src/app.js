import express from "express"
import { createServer } from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import connectToMongoose from "../utils/mongoose_connect.js"
import authRoutes from "./routes/auth_routes.js"
import favoritesRoutes from "./routes/favorites_routes.js"

dotenv.config();

const app = express()

const PORT = process.env.PORT || 2000;
const server = createServer(app)

const allowedOrigins = [
    "http://localhost:5173",
    "https://yourmoviez.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 204,
};

// Sicherheitsnetz: setze wichtige CORS-Header immer
app.use((req, res, next) => {
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


(async () => {
    const connected = await connectToMongoose();
    if (connected) {
        console.log("✅ MongoDB connected successfully");
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } else {
        console.error("❌ Server not started: Mongoose connection failed.");
        process.exit(1);
    }
})();

export default app;