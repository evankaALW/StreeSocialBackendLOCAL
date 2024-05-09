const express = require('express');
//const errorHandler = require('../middleware/errorHandlingMiddleware');
//const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const app = express();
const getUserResponse = require('../controllers/getUserResponseController');
const userResponseRouter = express.Router();

//userTableRoute.post('/login', userTableController.login);
userResponseRouter.get('/getUserResponse',getUserResponse.userResponseData);
//userResponseRouter.use(errorHandler);

module.exports=userResponseRouter;
