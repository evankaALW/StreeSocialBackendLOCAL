const express = require('express');
const app = express();
const getVideoDetails = require('../controllers/getPlayAllPlaylistController');
const getVideoDetailsRouter = express.Router();

getVideoDetailsRouter.get('/getPlayAllVideos/:videoName',getVideoDetails.videoData);

module.exports=getVideoDetailsRouter;
