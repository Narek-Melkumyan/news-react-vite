import {Router} from "express";
import {getUsers, } from "../../controller/usersController.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";


const app = Router();
app.use(authMiddleware)


app.get("/getUsers",getUsers)

export default app;