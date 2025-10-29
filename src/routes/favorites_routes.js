import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/favorites_controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.post("/toggle/:movieId", auth, toggleFavorite);
router.get("/", auth, getFavorites);

export default router;
