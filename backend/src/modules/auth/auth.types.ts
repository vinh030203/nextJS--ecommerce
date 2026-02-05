export interface UserInterface {
    email: string
    name: string
    password_hash: string
    role: string
    status: string
    emailVerified?: boolean
    twofactorEnable?: boolean
    emailVerificationToken?: string
    refreshTokens?: string
    twoFactorToken?: string
}
export type CreateEmailVerificationDTO = {
    user_id: string
    token_hash: string
    expires_at: Date
}