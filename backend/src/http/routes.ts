import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterController } from './controllers/register';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';
import { authorizeCreateUser } from '../middlewares/userAuthorization';
import { UpdateUserController } from './controllers/update-user';

const routes = Router();

const authController = new AuthenticateController();
const registerController = new RegisterController();
const updateUserController = new UpdateUserController();

routes.post('/authenticate', authController.login);

routes.post('/register', ensureAuthenticated, authorizeCreateUser(), registerController.register);
routes.put('/users/:id', ensureAuthenticated, updateUserController.update);

export { routes };
