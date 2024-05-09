const express = require('express');
const downloadPlaylistDetails = require('../controllers/postPlaylistLocalController');
const postPlaylistLocalRouter = express.Router();

postPlaylistLocalRouter.post('/downloadPlaylistToLocal',downloadPlaylistDetails.downloadPlaylistData);

module.exports=postPlaylistLocalRouter;
