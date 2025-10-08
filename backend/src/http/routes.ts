import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterController } from './controllers/register';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';
import { authorizeCreateUser } from '../middlewares/userAuthorization';

const routes = Router();

const authController = new AuthenticateController();
const registerController = new RegisterController();

routes.post('/authenticate', authController.login);

routes.post('/register', ensureAuthenticated, authorizeCreateUser(), registerController.register);

export { routes };
