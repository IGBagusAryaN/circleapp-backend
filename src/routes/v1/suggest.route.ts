import express from 'express';
import { getSuggestedUsers } from '../../controllers/suggested.controller';
import { authentication } from '../../middlewares/authentication';

const suggestRouter = express();

suggestRouter.get('/', authentication, getSuggestedUsers);

export default suggestRouter;
