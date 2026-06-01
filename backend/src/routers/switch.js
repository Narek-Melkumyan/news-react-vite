import {Router} from 'express';
import auth from "./auth.js";
import AdminIndex from "./admin/index.js";
import main from "./main.js";

const switchRouter = Router();

switchRouter.use('/', main);
switchRouter.use('/auth', auth);
switchRouter.use('/admin', AdminIndex);




export default switchRouter;