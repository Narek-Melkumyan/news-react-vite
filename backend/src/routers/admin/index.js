import {Router} from 'express';
import categoryRouter from "./category.js";
import articleRouter from "./article.js";
import userRouter from "./users.js";
import pollsRouter from "./polls.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";

const index = Router();
index.use(authMiddleware);


index.use('/categories',categoryRouter)
index.use("/articles",articleRouter)
index.use("/users",userRouter)
index.use("/polls",pollsRouter)


index.get("/", (req, res) => {
    res.json({
        message: "Admin dashboard",
        user: req.user,
    });
});




//dashboard
// articles
// categories
// polls
// comments
// users

export default index;