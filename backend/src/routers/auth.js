import {Router} from 'express';
import {login, logout, me, refresh, register} from "../controller/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const auth = Router();
auth.post('/login2', (req, res) => {
    res.json("hiii")
})

auth.post('/register',register)
auth.post('/login', login)
auth.post("/refresh", refresh);
auth.get("/me", authMiddleware, me);
auth.post("/logout", logout);

export default auth;