import express from "express";
const router = express.Router();
import { signUpSchema } from "../schema/signup_schema.js"
import { loginSchema } from "../schema/login_schema.js"
import valid from "../middleware/valid.js";
import { SignUpController } from "../controllers/signUp_controller.js"
import { loginController } from "../controllers/login_controller.js";
import { userProfil } from "../controllers/user_controller.js";
import { currentUserController } from "../controllers/currentUser_controller.js";
import isAuth from "../middleware/auth.js"



router.post("/signup", signUpSchema, valid, SignUpController);
router.post("/login", loginSchema, loginController)
router.get("/currentUser", currentUserController)


export default router;