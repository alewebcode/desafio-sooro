import { Router } from 'express';
import { AuthenticateController } from './controllers/authenticate';
import { RegisterController } from './controllers/register';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';
import { authorizeCreateUser, authorizeDeleteUser } from '../middlewares/userAuthorization';
import { UpdateUserController } from './controllers/update-user';
import { DeleteUserController } from './controllers/delete-user';
import { ListUserController } from './controllers/list-user';
import { CreateEvaluationController } from './controllers/create-evaluation';
import {
  authorizeCreateEvaluation,
  authorizeDeleteEvaluation,
  authorizeUpdateEvaluation,
} from '../middlewares/evaluationAuthorization';
import { UpdateEvaluationController } from './controllers/update-evaluation';
import { DeleteEvaluationController } from './controllers/delete-evaluation';
import { GetEvaluationController } from './controllers/get-evaluation';

const routes = Router();

const authController = new AuthenticateController();
const registerController = new RegisterController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const listUserController = new ListUserController();
const createEvaluationController = new CreateEvaluationController();
const updateEvaluationController = new UpdateEvaluationController();
const deleteEvaluationController = new DeleteEvaluationController();
const getEvaluationController = new GetEvaluationController();

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

routes.put(
  '/evaluations/:id',
  ensureAuthenticated,
  authorizeUpdateEvaluation(),
  updateEvaluationController.update,
);

routes.delete(
  '/evaluations/:id',
  ensureAuthenticated,
  authorizeDeleteEvaluation(),
  deleteEvaluationController.delete,
);

routes.get('/evaluations', ensureAuthenticated, getEvaluationController.list);

export { routes };
