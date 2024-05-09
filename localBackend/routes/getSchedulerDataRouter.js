const express = require('express');
//const errorHandler = require('../middleware/errorHandlingMiddleware');
//const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const app = express();
const getSchedulerData = require('../controllers/getSchedulerDataController');
const schedulerDataRouter = express.Router();

schedulerDataRouter.get('/getSchedulerData/:theatreid',getSchedulerData.schedulerData);
//schedulerDataRouter.use(errorHandler);

module.exports=schedulerDataRouter;
