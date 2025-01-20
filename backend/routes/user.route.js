import { Router } from "express";
import {registerUser,loginUser,userProfile, logoutUser,getAllUsersController} from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/profile").get(verifyJWT,userProfile)
router.route("/logout").get(verifyJWT,logoutUser)
router.route('/all-user').get(verifyJWT,getAllUsersController)



export default router