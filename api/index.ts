import { PrismaClient } from '@prisma/client';
import RestApiHandler from '@zenstackhq/server/api/rest';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const checkJwt = auth({
  audience: 'https://personal-expenses/api',
  issuerBaseURL: 'https://dev-5qtc1u8vxnkci4p2.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});
// app.use(checkJwt);

const apiHandler = RestApiHandler({ endpoint: 'http://localhost:3001/api' });
const prisma = new PrismaClient();
app.use(
  '/api',
  ZenStackMiddleware({
    getPrisma: () => prisma,
    handler: apiHandler,
  }),
);

// Vercel can't properly serve the Swagger UI CSS from its npm package, here we
// load it from a public location
const options = { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css' };
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, '../personal-expenses-api.json'), 'utf8'));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use('/docs', swaggerUI.serve as any, swaggerUI.setup(spec, options) as any);

export default app;
