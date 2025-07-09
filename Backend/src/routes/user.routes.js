import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);

// Protected Routes
userRouter.get("/profile",protect, getUserProfile);

export default userRouter;