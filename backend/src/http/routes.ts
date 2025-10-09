import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterController } from './controllers/register';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';
import { authorizeCreateUser, authorizeDeleteUser } from '../middlewares/userAuthorization';
import { UpdateUserController } from './controllers/update-user';
import { DeleteUserController } from './controllers/delete-user';
import { ListUserController } from './controllers/list-user';
import { CreateEvaluationController } from './controllers/create-evaluation';
import { authorizeCreateEvaluation } from '../middlewares/evaluationAuthorization';

const routes = Router();

const authController = new AuthenticateController();
const registerController = new RegisterController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const listUserController = new ListUserController();
const createEvaluationController = new CreateEvaluationController();

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

routes.post(
  '/evaluations',
  ensureAuthenticated,
  authorizeCreateEvaluation(),
  createEvaluationController.create,
);

export { routes };
