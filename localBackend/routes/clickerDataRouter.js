const express = require('express');
const postClickerDetails = require('../controllers/postClickerFormController');
const getClickerDetails = require('../controllers/getClickerDataController');
const clickerDataRouter = express.Router();

clickerDataRouter.post('/addClickerData',postClickerDetails.clickerData);
clickerDataRouter.get('/getClickerData', getClickerDetails.getClickerData);

module.exports=clickerDataRouter;
