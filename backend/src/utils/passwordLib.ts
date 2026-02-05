import { genSalt, hash, compare } from "bcryptjs"
const hashedPassword = async (password: string) => {
    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)
    return hashPassword

}

export { hashedPassword }