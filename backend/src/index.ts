import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import CategoriesRouter from "./routes/category.route";
import MovementsRouter from "./routes/movement.route";
import UsersRouter from "./routes/user.route";

export const prisma = new PrismaClient();

const app = express();

const port = 4000;

const checkJwt = auth({
  audience: "https://personal-expenses/api",
  issuerBaseURL: "https://dev-5qtc1u8vxnkci4p2.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

async function main() {
  // API Server
  app.use(express.json());
  app.use(cors());

  // Register API routes
  app.use("/api/v1/movements", checkJwt, MovementsRouter);
  app.use("/api/v1/categories", checkJwt, CategoriesRouter);
  app.use("/api/v1/users", checkJwt, UsersRouter);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    console.info(`connecting to database ${process.env.SUPABASE_URL}`);
    await prisma.$connect();
    console.info("connected to database.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
