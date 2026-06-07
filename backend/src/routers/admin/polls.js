import { Router } from "express";

import {
    addPoll,
    getPolls,
    getPollById,
    updatePoll, deletePoll, getPollResults,
} from "../../controller/pollsController.js";

const pollsRouter = Router();

pollsRouter.get("/getPolls", getPolls);
pollsRouter.get("/getPoll/:id", getPollById);
pollsRouter.get("/getPollResults/:id", getPollResults);
pollsRouter.post("/addPoll", addPoll);
pollsRouter.put("/updatePoll/:id", updatePoll);
pollsRouter.delete("/deletePoll/:id", deletePoll);

export default pollsRouter;