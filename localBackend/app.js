const cors = require('cors'); // Import the cors middleware
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const playlistTable = require('./models/playlistTable')
const clickerDeviceDetailsTable = require('./models/clickerDeviceDetailsTable')
const movieLocalTable = require('./models/movieLocalTable');
const advertisementLocalTable = require('./models/advertisementLocalTable');
const questionLocalTable = require('./models/questionLocalTable');

const schedulerDataRouter = require('../localBackend/routes/getSchedulerDataRouter');
const userResponseRouter = require('../localBackend/routes/getUserResponseDataRouter');
const putDisplayToggleRouter = require('../localBackend/routes/putDisplayToggleRouter');
const allVideoDetailsRouter = require('../localBackend/routes/allVideoDetailsRouter');
const fileDownloadOptionRouter = require('./routes/getFileDownloadOptionRouter');
const postPlaylistLocalRouter = require('./routes/postPlaylistLocalRouter');
const getPlaylistLocalRouter = require('./routes/getLocalPlaylistRouter');
const clickerDataRouter = require('./routes/clickerDataRouter');
const getVideoDetailsRouter = require('./routes/getPlayAllPlaylistRouter');

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('',schedulerDataRouter);
app.use('',userResponseRouter);
app.use('',putDisplayToggleRouter);
app.use('',allVideoDetailsRouter);
app.use('',fileDownloadOptionRouter);
app.use('',postPlaylistLocalRouter);
app.use('',getPlaylistLocalRouter);
app.use('',clickerDataRouter);
app.use('',getVideoDetailsRouter);

const PORT =  8014;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
