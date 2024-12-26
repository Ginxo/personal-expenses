import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import path from "path";
import CategoriesRouter from "./routes/category.route";
import MovementsRouter from "./routes/movement.route";
import UsersRouter from "./routes/user.route";

export const prisma = new PrismaClient();

const app = express();

const port = 3000;

const checkJwt = auth({
  audience: "https://personal-expenses/api",
  issuerBaseURL: "https://dev-5qtc1u8vxnkci4p2.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

async function main() {
  // API Server
  app.use(express.json());
  app.use(cors());
  app.use(checkJwt);

  // Register API routes
  app.use("/api/v1/movements", MovementsRouter);
  app.use("/api/v1/categories", CategoriesRouter);
  app.use("/api/v1/users", UsersRouter);

  // Static Content
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Handle requests by serving index.html for all routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });

  // Catch unregistered routes
  // app.all('*', (req: Request, res: Response) => {
  //   res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  // });

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
