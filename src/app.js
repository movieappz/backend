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

const allowedOrigins = ["http://localhost:5173"];

// ⚠️ WICHTIG: Reihenfolge der Middleware!
// 1. CORS ZUERST
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Routes (nicht mehr im Mongoose-Check!)
app.use(authRoutes);
app.use("/favorites", favoritesRoutes);

// 5. Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// ⚠️ Mongoose Connection EINMAL beim Start
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