import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';

const routes = Router();

const authController = new AuthenticateController();

routes.post('/authenticate', authController.login);

export { routes };
