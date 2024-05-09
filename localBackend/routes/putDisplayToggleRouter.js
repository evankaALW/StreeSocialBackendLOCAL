const express = require('express');
////const errorHandler = require('../middleware/errorHandlingMiddleware');
const putDisplayToggleController = require('../controllers/putDisplayToggleController');
const putDisplayToggleRouter = express.Router();

putDisplayToggleRouter.put('/changeDisplayToggle',putDisplayToggleController.putDisplayToggle);
//putDisplayToggleRouter.use(errorHandler);

module.exports=putDisplayToggleRouter;
