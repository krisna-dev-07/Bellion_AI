import { Router } from "express";
import {registerUser,loginUser,userProfile, logoutUser} from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/profile").get(verifyJWT,userProfile)
router.route("/logout").get(verifyJWT,logoutUser)


export default router