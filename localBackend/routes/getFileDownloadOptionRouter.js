const express = require('express');
const app = express();
const getFileDownloadDetails = require('../controllers/downloadPlaylistFilesController');
const fileDownloadOptionRouter = express.Router();

fileDownloadOptionRouter.get('/getFileDownloadOption',getFileDownloadDetails.fileDownloadData);

module.exports=fileDownloadOptionRouter;
