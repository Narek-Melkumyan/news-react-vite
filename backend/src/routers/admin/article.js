import {Router} from "express";
import {
    addPost,
    deletePost, editArticle,
    generateArticleWithAI,
    getAllSlugs, getArticleById,
    getAuthors,
    getPosts
} from "../../controller/articleController.js";
import {upload} from "../../services/UploaderService.js";
import {RolesMiddleware} from "../../middleware/rolesMiddleware.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";
const articleRouter = Router();
articleRouter.use(authMiddleware);
articleRouter.use(RolesMiddleware)
articleRouter.get("/", getPosts);
articleRouter.get("/getAuthors", getAuthors);
articleRouter.get("/getSlugs", getAllSlugs);
articleRouter.post("/generateByIA", generateArticleWithAI);

articleRouter.post("/", upload.single("thumbnail"), addPost);

articleRouter.get("/:id", getArticleById);
articleRouter.put("/:id", upload.single("thumbnail"), editArticle);
articleRouter.delete("/:id", deletePost);


export default articleRouter;