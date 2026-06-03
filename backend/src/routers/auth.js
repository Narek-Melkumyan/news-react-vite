import { Router } from "express";
import { login, logout, me, register } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.post("/logout", logout);

auth.use(authMiddleware);

auth.get("/me", me);

export default auth;


