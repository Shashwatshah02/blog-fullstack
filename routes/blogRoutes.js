import express from "express";
import blogController from "../controller/blogController.js";

const router = express.Router();

router.get('/all', blogController.getAllBlogs);
router.get('/categories', blogController.getAllCategories)
router.post('/categories', blogController.addCategories)
router.get('/categories/delete/:id', blogController.deleteCategorybyId)
router.post('/create', blogController.createBlog);
router.get('/create', blogController.getCreateBlogPage);
router.get('/view/:id', blogController.getBlogById);
router.get('/delete/:id', blogController.deleteBlogbyId);
router.get('/edit/:id', blogController.getEditBlog);
router.post('/update/:id', blogController.updateBlog);

// Use export default instead of module.exports
export default router;
