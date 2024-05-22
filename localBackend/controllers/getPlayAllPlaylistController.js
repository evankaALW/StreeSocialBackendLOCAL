const connection = require('../config/db');
const path = require('path');
const fs = require('fs');

const getVideoDetails = {
    videoData: async (req, res) => {
        try {
                const videoDirectory = `C:\\Users\\DELL\\OneDrive\\Documents\\videos\\`;
                //const videoDirectory = `D:\\streesocial_new_LIVE01042024\\STREESOCIAL_FRONTEND\\public\\videos\\videosTesting\\`;
                const videoName = req.params.videoName;
                const videoPath = path.join(videoDirectory, videoName);
                console.log("videoPath",videoPath)
                fs.stat(videoPath, (err, stat) => {
                    if (err) {
                        return res.status(404).send('Video not found');
                    }
                    console.log("playing video from backend server")

                    res.sendFile(videoPath);
                });
        }
        catch (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ error: 'Error playing video' });
        }
    }
};

module.exports = getVideoDetails;
