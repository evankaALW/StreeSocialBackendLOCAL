
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/videoPlaylist.css';
import config from '../config';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons
const apiUrl = `${config.apiBaseUrl}`;



export const VideoPlaylist = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [downloadInitiate, setDownloadInitiate] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState();
  const [localParentFolderURL, setLocalParentFolderURL] = useState('');
  const [liveParentFolderURL, setLiveParentFolderURL] = useState('');
  const [downloadStatus, setDownloadStatus] = useState({}); // State variable to track download status

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'localParentFolderURL') {
      setLocalParentFolderURL(value);
    } else if (name === 'liveParentFolderURL') {
      setLiveParentFolderURL(value);
    }
  }
  useEffect(() => { // Fetch scheduler data from the backend API using axios
    axios.get(`${apiUrl}/getSchedulerData/1`)//hardcoded the theatreid
      .then(response => {
        setSchedulerData(response.data.schedulerDetails);
        console.log("Response",response.data)
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

   const downloadAllVideos = async (event, videoObject) => {
   //const startDate = videoObject.startDate.replace(/[^\w\s]/gi, '');
    alert("Download initiated...")
    event.preventDefault();
     const downloadPath = `C:\\Users\\DELL\\OneDrive\\Documents\\videos\\`;
    const jsonData = JSON.parse(videoObject.videoLinks);
     const filteredData = jsonData.filter(item => item.Videolink !== "" && item.Videolink !== null);
  
     try {
       // Map each link to an axios request
       const downloadPromises = filteredData.map((link, index) => {
         const linkKey = Object.keys(link)[0];
         const linkValue = Object.values(link)[0];
         const fileName = linkValue;
  
         return axios.get(`${apiUrl}/getFileDownloadOption`, {
           params: {
             videoURL: fileName,
             liveFileServerURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/',
             localFileParentURL: downloadPath,
           }
         });
       });
  
       // Wait for all axios requests to complete
       const responses = await Promise.all(downloadPromises);
  
       // Handle the responses
       responses.forEach(response => {
         alert(response.data.download);
       });

       //download playlist file paths from live db to local db
     } catch (error) {
       console.error('Error downloading videos:', error);
     }

     try {
             const res = await axios.post(`${apiUrl}/downloadPlaylistToLocal`, {
               schedulerData: videoObject,
             });
        
             console.log(res);
             alert(res.data.message);
           } catch (error) {
             console.error('Error downloading playlist:', error);
             alert('Error downloading playlist');
           }
   };


  const renderDownloadStatusIcon = (index) => {
    if (downloadStatus[index]) {
      return <FaCheck color="green" />; // Display checkmark icon for successful download
    } else if (downloadStatus[index] === false) {
      return <FaTimes color="red" />; // Display cross icon for failed download
    } else {
      return null; // No status yet
    }
  };

  const renderSchedulerPlaylist = () => {

    if (!schedulerData || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }  
  return schedulerData.map((scheduler, index) => (
    <div key={index} className="nested-scheduler-container">
      <div className="scheduler-playlist-item">
        <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.premiereDate).toDateString()}`}</h3>
        <ul>
        {JSON.parse(scheduler.videoLinks)
          .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
          .map((videoLink, videoIndex) => {
            const linkKey = Object.keys(videoLink)[0]; // Get the key of the video link
            const linkValue = Object.values(videoLink)[0]; // Get the value of the video link
            return (
              <li key={videoIndex}>
                <a href={linkValue} target="_blank" rel="noopener noreferrer">
                  {`${linkKey}: ${linkValue}`}
                </a>
                <br/>
                {renderDownloadStatusIcon(videoIndex)} {/* Render download status icon */}
              </li>
            );
          })}
        </ul>
        <button onClick={(event) => downloadAllVideos(event, scheduler)}>Download All</button>
      </div>
    </div>
  ));
};

  return (
    <>
      <h1>Operator Playlist</h1>
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};