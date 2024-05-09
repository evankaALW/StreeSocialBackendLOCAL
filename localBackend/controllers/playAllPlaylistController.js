const folderPath = 'D:/1Play'; // Change this to the path of your video folder

app.get('/videos', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return res.status(500).json({ error: 'Error reading folder' });
    }

    // Filter out non-video files
    const videoFiles = files.filter(file => file.endsWith('.mp4'));

    // Generate URLs for the video files
    const videoURLs = videoFiles.map(file => `${req.protocol}://${req.get('host')}/videos/${encodeURIComponent(file)}`);

    res.json({ videos: videoURLs });
  });
});

// Serve video files
app.get('/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Error accessing video file:', err);
      return res.status(404).json({ error: 'Video file not found' });
    }

    // Set response headers for streaming video
    res.setHeader('Content-Type', 'video/mp4');

    // Send the video file
    res.sendFile(filePath);
  });
});