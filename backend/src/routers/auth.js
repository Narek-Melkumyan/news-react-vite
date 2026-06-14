import { Router } from "express";
import {login, logout, me, refresh, register} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const auth = Router();


auth.post("/login", login);
auth.post("/refresh", refresh);
auth.post("/logout", logout);

auth.use(authMiddleware);
auth.post("/register", register);
auth.get("/me", me);

export default auth;


