import { Prisma } from "@prisma/client";
import { authRepository } from "./auth.repo";
import crypto, { hash, verify } from "crypto"
import { hashedPassword } from "../../utils/passwordLib";
import { getAppUrl } from "../../utils/appUrlLib";
import { sendEmail } from "../../utils/sendEmailLib";
import prismadb from "../../lib/prisma";


export const authService = {
    async sendVerifyEmail(email: string, token: string) {
        const verifyLink = `${getAppUrl()}/auth/verify-email?token=${token}`

        sendEmail(
            email,
            "Verify your email",
            `
      <p>Please verify your email</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `
        ).catch(console.error)
    },
    async createUser(data: { name: string, email: string, password_hash: string }) {
        const existingUser = await authRepository.findByEmail(data.email)
        if (existingUser) {
            throw new Error("email is already registered")
        }
        const hashed = await hashedPassword(data.password_hash)

        const user = await authRepository.create({
            email: data.email,
            name: data.name,
            password_hash: hashed,
            role: "user",
            emailVerified: false,
            twofactorEnable: false,
        })
        const rawToken = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await authRepository.createEmailRecord({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt
        })

        await this.sendVerifyEmail(
            user.email,
            rawToken
        )

        return user
    },

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return authRepository.update(id, data)
    },
    async deleteUser(id: string) {
        return authRepository.delete(id)
    },
    async findEmailUser(email: string) {
        return authRepository.findByEmail(email)
    },
    async verifyEmailUser(token: string) {
        if (!token || typeof token !== "string") {
            throw new Error("Token must be a string")
        }
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const record = await prismadb.emailVerificationToken.findUnique({
            where: { token_hash: tokenHash },
            include: { user: true }
        })
        if (!record) {
            throw new Error("Invalid verification token");
        }

        if (record.emailverify_in) {
            throw new Error("Verification link already used");
        }

        if (record.expires_at < new Date()) {
            throw new Error("Verification link expired");
        }
        await prismadb.$transaction([
            prismadb.user.update({
                where: { id: record.user_id },
                data: { emailVerified: true },
            }),
            prismadb.emailVerificationToken.update({
                where: { id: record.id },
                data: { emailverify_in: new Date() },
            }),
        ]);
    },
    async checkUserAvailable(email: string) {
        const user = await authRepository.findByEmail(email)
        if (user) {

        }

    }

}
