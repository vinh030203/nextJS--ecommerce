import * as z from "zod"

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
})
const verifyEmailSchema = z.object({
    token: z.string(),
})


export { registerSchema, verifyEmailSchema }