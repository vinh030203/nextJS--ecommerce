import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_NAME,
        pass: process.env.SMTP_PASSWORD,
    },
})
const verifySMTP = async () => {
    try {
        await transporter.verify()
        console.log("SMTP ready")
    } catch (err) {
        console.error("SMTP connection failed", err)
        process.exit(1)
    }
}
const sendEmail = async (
    to: string,
    subject: string,
    html: string
) => {
    return transporter.sendMail({
        from: `"MyApp@gmail.com"`,
        to,
        subject,
        html,
    })
}
export { sendEmail, verifySMTP }