const express = require('express');
//const errorHandler = require('../middleware/errorHandlingMiddleware');
//const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const app = express();
const allVideoDetailsController = require('../controllers/allVideoDetailsController');
const allVideoDetailsRouter = express.Router();

allVideoDetailsRouter.get('/allVideoDetails',allVideoDetailsController.getAllVideoDetails);
//allVideoDetailsRouter.use(errorHandler);

module.exports=allVideoDetailsRouter;
