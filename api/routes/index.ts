import { Router } from 'express';
import auth from './auth';
import users from './users';
//import agendash from './agendash';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	users(app);
	//agendash(app);

	return app
}