import swaggerUi from 'swagger-ui-express'
import definition from './definition.json' assert { type: 'json' };
import { Router } from 'express';
const router = Router();

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(definition, { explorer: true })
);

export default router;