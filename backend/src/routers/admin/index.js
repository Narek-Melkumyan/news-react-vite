import {Router} from 'express';
import categoryRouter from "./category.js";
import articleRouter from "./article.js";
import userRouter from "./users.js";
import pollsRouter from "./polls.js";

const index = Router();
index.use((req, res, next) => {
    const isLogin=true
    if(isLogin){
        next()
    }
})

index.use('/categories',categoryRouter)
index.use("/articles",articleRouter)
index.use("/users",userRouter)
index.use("/polls",pollsRouter)


index.get('/', (req, res) => {
    res.send('index');
})




//dashboard
// articles
// categories
// polls
// comments
// users

export default index;