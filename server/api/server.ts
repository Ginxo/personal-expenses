import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import MovementsRouter from './routes/movement.route';
import CategoriesRouter from './routes/category.route';
import UsersRouter from './routes/user.route';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

export const prisma = new PrismaClient();

const app = express();

const port = 3000;

const checkJwt = auth({
  audience: 'https://personal-expenses/api',
  issuerBaseURL: 'https://dev-5qtc1u8vxnkci4p2.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

async function main() {
  app.use(express.json());
  app.use(cors());
  app.use(checkJwt);

  // Register API routes
  app.use('/api/v1/movements', MovementsRouter);
  app.use('/api/v1/categories', CategoriesRouter);
  app.use('/api/v1/users', UsersRouter);

  // Catch unregistered routes
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    console.info(`connecting to database ${process.env.SUPABASE_URL}`);
    await prisma.$connect();
    console.info('connected to database.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
