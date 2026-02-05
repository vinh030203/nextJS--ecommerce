import { Prisma, User } from "@prisma/client"
import prismadb from "../../lib/prisma"
import { CreateEmailVerificationDTO, UserInterface } from "./auth.types"
export const authRepository = {
    create: (data: Prisma.UserCreateInput) => {
        return prismadb.user.create({ data })
    },
    update: (id: string, data: Prisma.UserUpdateInput) => {
        return prismadb.user.update({
            where: { id },
            data: data,
        })
    },
    delete: (id: string) => {
        return prismadb.user.delete({
            where: { id }
        })
    },
    findByEmail: (email: string) => {
        return prismadb.user.findUnique({
            where: { email: email }
        })
    },
    createEmailRecord: (data: CreateEmailVerificationDTO) => {
        return prismadb.emailVerificationToken.create({
            data
        })
    }



}
