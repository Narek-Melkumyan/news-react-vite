import {Router} from "express";
import {addPoll, getPolls} from "../../controller/pollsController.js";


const pollsRouter = Router();

pollsRouter.get("/getPolls",getPolls)
pollsRouter.post("/addPoll",addPoll)

export default pollsRouter;