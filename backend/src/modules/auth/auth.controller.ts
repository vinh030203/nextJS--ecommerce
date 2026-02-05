import { Request, Response } from "express";
import { authService } from "./auth.services";
import { verifyEmailSchema, registerSchema } from "./auth.schema";

export const authController = {
    async create(req: Request, res: Response) {
        try {
            const parsed = registerSchema.safeParse(req.body)
            if (!parsed.success) {
                throw new Error(parsed.error.message)
            }
            const { name, email, password } = parsed.data

            const user = await authService.createUser({
                email: email,
                name: name,
                password_hash: password,

            })

            return res.status(201).json({
                success: true,
                message: "User created successfully. Please verify your email.",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified,
                },
            })

        } catch (error) {
            console.log("create user error ", error);

            return res.status(500).json({
                success: false,
                message: " internal server error"
            })

        }
    },
    async verifyEmail(req: Request, res: Response) {
        try {
            const parsed = verifyEmailSchema.safeParse({
                token: req.query.token,
            })
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification token",
                })
            }
            console.log(parsed.data.token);

            await authService.verifyEmailUser(parsed.data.token)

            return res.status(200).json({
                success: true,
                message: "Email verified successfully",
            })

        } catch (error) {
            console.log("error email verify ", error);

            return res.status(500).json({
                success: false,
                message: " internal server error"
            })

        }
    }
}