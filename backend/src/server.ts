import express, { Request, Response } from "express";
import dotenv from "dotenv";
import prismadb from "./lib/prisma";
import { verifySMTP } from "./utils/sendEmailLib";
import authRoutes from "./modules/auth/auth.routes"

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes)
async function startServer() {
  try {
    await prismadb.$connect();
    console.log(" Connected to Supabase successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
    await verifySMTP()
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prismadb.$disconnect();
  process.exit(0);
});