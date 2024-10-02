import express from "express";
import blogController from "../controller/blogController.js";
import isAuthenticated from "../middleware/userAuth.js";

const router = express.Router();

router.get("/all", isAuthenticated, blogController.getAllBlogs);
router.get("/", blogController.getEverything);
router.get("/categories", blogController.getAllCategories);
router.post("/categories", blogController.addCategories);
router.get("/categories/delete/:id", blogController.deleteCategorybyId);
router.post("/create", blogController.createBlog);
router.get("/create", blogController.getCreateBlogPage);
router.get("/view/:id", blogController.getBlogById);
router.get("/delete/:id", blogController.deleteBlogbyId);
router.get("/edit/:id", blogController.getEditBlog);
router.post("/update/:id", blogController.updateBlog);

// Use export default instead of module.exports
export default router;
