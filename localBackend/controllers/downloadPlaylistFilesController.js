const http = require('http');
const https = require('https');
const fs = require('fs');

const getFileDownloadDetails = {
  fileDownloadData: async (req, res) => {
    let liveSizeInMB;
    let localSizeInMB;
    let errorIndex = 0;
    const { videoURL, liveFileServerURL, localFileParentURL } = req.query;
    
    // Local file
    const filePath = `${localFileParentURL}${videoURL}`;
    console.log("local filePath", filePath, videoURL)

    fs.readdir(localFileParentURL, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return res.status(500).json({ error: 'Error reading folder' });
      }
      // Filter out non-video files
      const videoFiles = files.filter(file => file.endsWith('.mp4'));
      const videoURLExists = videoFiles.includes(`${videoURL}`);

      if(videoURLExists)
      {
        const localURL = `${localFileParentURL}${videoURL}`;
        fs.stat(localURL, (err, stats) => {
          if(err){
            console.error('Error getting file stats:', err);
            return res.status(500).json({ error: 'Error getting file stats' });
          }
          else{
            errorIndex = 0;
            console.log(errorIndex, "errorind");
            localSizeInMB = Math.round((stats.size / (1024 * 1024)) * 100) / 100;
            console.log("Response localSizeInMB", localSizeInMB);
          }
        });
      }
      else{
        errorIndex = 1;
        console.log(errorIndex, "errorind");
      }
      console.log("videoFiles",videoFiles)
    });

    // Live file
    try {
      const liveUrl = liveFileServerURL + videoURL;
      console.log("url", liveUrl);
      const protocol = liveUrl.startsWith('https') ? https : http;
      protocol.get(liveUrl, async (response) => {
        let liveSizeInBytes = 0;
        const buffers = [];
        response.on('data', (chunk) => {
          liveSizeInBytes += chunk.length;
          buffers.push(chunk);
        });
        response.on('end', async () => {
          liveSizeInMB = Math.round((liveSizeInBytes / (1024 * 1024)) * 100) / 100;
          console.log("Response backend ", liveSizeInMB)
          if (liveSizeInMB) {
            if (liveSizeInMB == localSizeInMB) {
              return res.status(200).json({ download: `File ${videoURL} exists, no download` });
            }
          }

          if (!liveSizeInMB || (liveSizeInMB != localSizeInMB) || errorIndex == 1) {
            try {
              console.log("downloadFile initiated");
              const fetch = await import('node-fetch').then(module => module.default); // Dynamic import
              // Send request to server to download the file
              const buffer = Buffer.concat(buffers);
              // Write the Buffer to a file in the specified download path
              fs.writeFileSync(`${localFileParentURL}/${videoURL}`, buffer);
              console.log(`File ${videoURL} downloaded successfully`);
              console.log("downloadFile complete");
            } catch (error) {
              console.error(`Error downloading file ${videoURL}:`, error);
              throw error; // Propagate the error to the caller
            }
            return res.status(200).json({download:`Download successful for file ${videoURL}`});
          }
        })
      });

    } catch (error) {
      console.error('Error executing MySQL query:', error);
      return res.status(500).json({ error: 'Error retrieving data from live file server' });
    }

    //return res.status(200).json({ "download": "download" });


  }
};

module.exports = getFileDownloadDetails;