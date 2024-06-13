 const http = require('http');
 const https = require('https');
 const fs = require('fs').promises;

 const getFileDownloadDetails = {
 fileDownloadData: async (req, res) => {
     let liveSizeInMB;
     let localSizeInMB;
     let errorIndex = 0;
     let message = '';
     const { videoURL, liveFileServerURL, localFileParentURL } = req.query;
    
     try {
       // Local file
       const filePath = `${localFileParentURL}${videoURL}`;
       console.log("local filePath", filePath, videoURL);

       const files = await fs.readdir(localFileParentURL);
       const videoFiles = files.filter(file => file.endsWith('.mp4'));
       const videoURLExists = videoFiles.includes(videoURL);

       if (videoURLExists) {
         const localURL = `${localFileParentURL}${videoURL}`;
         try {
           const stats = await fs.stat(localURL);
           localSizeInMB = Math.round((stats.size / (1024 * 1024)) * 100) / 100;
           console.log("Response localSizeInMB", localSizeInMB);
         } catch (err) {
           console.error('Error getting file stats:', err);
           errorIndex = 1;
         }
       } else {
         errorIndex = 1;
         console.log(errorIndex, "errorind");
       }

       // Live file
       const liveUrl = liveFileServerURL + videoURL;
       console.log("url", liveUrl);
       const protocol = liveUrl.startsWith('https') ? https : http;

       protocol.get(liveUrl, (response) => {
         let liveSizeInBytes = 0;
         const buffers = [];
         response.on('data', (chunk) => {
           liveSizeInBytes += chunk.length;
           buffers.push(chunk);
         });
         response.on('end', async () => {
           liveSizeInMB = Math.round((liveSizeInBytes / (1024 * 1024)) * 100) / 100;
           console.log("Response backend ", liveSizeInMB);

           if (liveSizeInMB && liveSizeInMB == localSizeInMB) {
               message = `File ${videoURL} exists, no download`;
               return res.status(200).json({ download: message });
           }

           if (!liveSizeInMB || (liveSizeInMB != localSizeInMB) || errorIndex == 1) {
             try {
               console.log("downloadFile initiated");
               const buffer = Buffer.concat(buffers);
               await fs.writeFile(`${localFileParentURL}/${videoURL}`, buffer);
               console.log(`File ${videoURL} downloaded successfully`);
               message = `Download successful for file ${videoURL}`;
               return res.status(200).json({ download: message });
             } catch (error) {
               console.error(`Error downloading file ${videoURL}:`, error);
               res.status(500).json({ error: `Error downloading file ${videoURL}: ${error.message}` });
             }
           }
         });
       }).on('error', (err) => {
         console.error('Error fetching live file:', err);
         return res.status(500).json({ error: `Error fetching live file: ${err.message}` });
       });

     } catch (error) {
       console.error('Error reading local files or executing MySQL query:', error);
       return res.status(500).json({ error: error.message });
     }
   }
 };

 module.exports = getFileDownloadDetails;

