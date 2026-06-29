import {Router} from 'express';

import {
    getAllArticlesByCategoryId,
    getArticleBySlug,
    getDailyQuotes, getInternational, getPoll, getVideoById, getVideos, homePage,
    mainIndex, mostRead,
     regionsAndInterviews, searchArticles, votePoll,
} from "../controller/mainController.js";
import {Home} from "../controller/rssController.js";
import {searchRateLimiter} from "../middleware/searchLimitMiddleware.js";
import {verifyTurnstile} from "../middleware/cloudFlareTurnstileMiddleware.js";

const main = Router();


main.get("/header", mainIndex);
main.get("/homePage", homePage );
main.get("/home-posts", mostRead );
main.get("/regionsAndInterviews", regionsAndInterviews );
main.get("/quotes", getDailyQuotes)
main.get("/videos",getVideos);
main.get("/getInternational",getInternational);
main.get("/poll", getPoll);
main.post("/vote", votePoll);
main.get("/getArticle/:slug", getArticleBySlug);
main.get("/getVideo/:id", getVideoById);
main.get("/getAllArticlesById/:id",getAllArticlesByCategoryId)
main.get("/rss",Home)
main.get("/search",searchRateLimiter,verifyTurnstile,searchArticles)



export default main;
