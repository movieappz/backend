import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/favorites_controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Favoriten umschalten (hinzufügen/entfernen)
router.post("/toggle/:movieId", auth, toggleFavorite);

// Alle Favoriten eines Benutzers abrufen
router.get("/", auth, getFavorites);

export default router;
