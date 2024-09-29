import express from "express";
import userController from "../controller/userController.js";


const router = express.Router();

router.get("/login", (req, res)=>{
    res.render("login")
});
router.post("/login", userController.checkAuth)

// Use export default instead of module.exports
export default router;
