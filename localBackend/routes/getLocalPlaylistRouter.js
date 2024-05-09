const express = require('express');
const app = express();
const getPlaylistLocalDetails = require('../controllers/getLocalPlaylistController');
const getPlaylistLocalRouter = express.Router();

getPlaylistLocalRouter.get('/getPlaylistLocal',getPlaylistLocalDetails.getPlaylistLocalData);

module.exports=getPlaylistLocalRouter;
