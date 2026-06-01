import {Router} from 'express';

import {
    getAllArticlesByCategoryId,
    getArticleBySlug,
    getDailyQuotes, getInternational, getVideoById, getVideos, homePage,
    mainIndex, mostRead,
    pool, regionsAndInterviews,
    votes
} from "../controller/mainController.js";

const main = Router();


main.get("/header", mainIndex);
main.get("/homePage", homePage );
main.get("/home-posts", mostRead );
main.get("/regionsAndInterviews", regionsAndInterviews );
main.get("/quotes", getDailyQuotes)
main.get("/videos",getVideos);
main.get("/getInternational",getInternational);
main.get("/poll", pool);
main.post("/vote", votes);
main.get("/getArticle/:slug", getArticleBySlug);
main.get("/getVideo/:id", getVideoById);
main.get("/getAllArticlesById/:id",getAllArticlesByCategoryId)





export default main;