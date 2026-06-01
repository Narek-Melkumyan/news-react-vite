import {Router} from 'express';
import {addCategory, deleteCategory, getAllCategories, updateCategory} from "../../controller/categoryController.js";


const categoryRouter = Router();

categoryRouter.get("/", getAllCategories)
categoryRouter.post("/", addCategory)
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.put("/:id", updateCategory);


export default categoryRouter;