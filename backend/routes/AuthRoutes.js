import {Router} from "express";
import { signup,login,getUserInfo,updateProfile,addProfileImage,removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from  "multer" 

const authRoutes=Router();
const upload=multer({dest:"uploads/profiles"});//this will create a image and upload image in it

authRoutes.post("/signup",signup);

authRoutes.post("/login",login);

authRoutes.get("/user-info",verifyToken,getUserInfo);

authRoutes.post("/update-profile",verifyToken,updateProfile);

authRoutes.post("/logout",logout);

authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"),addProfileImage);

authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage);
//this will remove the image from server and db hence setting image to null in db
export default authRoutes;
