import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterController } from './controllers/register';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';
import { authorizeCreateUser, authorizeDeleteUser } from '../middlewares/userAuthorization';
import { UpdateUserController } from './controllers/update-user';
import { DeleteUserController } from './controllers/delete-user';
import { ListUserController } from './controllers/list-user';

const routes = Router();

const authController = new AuthenticateController();
const registerController = new RegisterController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const listUserController = new ListUserController();

routes.post('/authenticate', authController.login);

routes.post('/register', ensureAuthenticated, authorizeCreateUser(), registerController.register);
routes.put('/users/:id', ensureAuthenticated, updateUserController.update);
routes.delete(
  '/users/:id',
  ensureAuthenticated,
  authorizeDeleteUser(),
  deleteUserController.delete,
);

routes.get('/users', ensureAuthenticated, listUserController.list);

export { routes };
