import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()



router.post("/register", authController.create)
router.get("/verify-email", authController.verifyEmail)



export default router