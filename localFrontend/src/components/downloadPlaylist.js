
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/videoPlaylist.css';
import config from '../config';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons
const apiUrl = `${config.apiBaseUrl}`;



export const DownloadPlaylist = () => {
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

   // Helper function to check if Part 1 of a movie is already printed
const hasPartOnePrinted = (videoName, printedVideos) => {
  return printedVideos.some(video => video === `${videoName} - Part 1`);
};

  const renderSchedulerPlaylist = () => {

         if (!schedulerData || schedulerData.length === 0) {
           return <p>No live playlist data available.</p>;
         } 
    // return schedulerData.map((scheduler, index) => (
    //   <div key={index} className="nested-scheduler-container">
    //     <div className="scheduler-playlist-item">
    //       <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.premiereDate).toDateString()}`}</h3>
    //       <ul>
    //         {JSON.parse(scheduler.videoLinksAndName)
    //           .filter(videoLink => videoLink && videoLink.Videolink && videoLink.advertisementName) // Filter out null or empty links and names
    //           .map((videoLink, videoIndex) => {
    //             const { Videolink, advertisementName } = videoLink; // Destructure the videoLink object
    //             return (
    //               <li key={videoIndex}>
    //                 <a href={Videolink} target="_blank" rel="noopener noreferrer">
    //                   {`${advertisementName}: ${Videolink}`}
    //                 </a>
    //                 <br/>
    //               </li>
    //             );
    //           })}
    //       </ul>
    //       <button onClick={(event) => downloadAllVideos(event, scheduler)}>Download All</button>
    //     </div>
    //   </div>
    // )); 

    return schedulerData.map((scheduler, index) => {
      const printedVideos = [];
      return (
        <div key={index} className="nested-scheduler-container">
          <div className="scheduler-playlist-item">
            <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.premiereDate).toDateString()}`}</h3>
            <ul>
              {JSON.parse(scheduler.videoLinksAndName)
                .filter(videoLink => videoLink && videoLink.Videolink) // Filter out null or empty links
                .map((videoLink, videoIndex) => {
                  const { Videolink, advertisementName, videoName } = videoLink; // Destructure the videoLink object
                  let displayName;
  
                  // Determine what to display based on the presence of advertisementName or videoName
                  if (advertisementName) {
                    displayName = `${advertisementName}: ${Videolink}`;
                  } else if (videoName) {
                    const movieName = videoName.split(' - Part ')[0];
                    if (hasPartOnePrinted(movieName, printedVideos)) {
                      displayName = `${movieName} - Part 2: ${Videolink}`;
                      printedVideos.push(`${movieName} - Part 2`);
                    } else {
                      displayName = `${movieName} - Part 1: ${Videolink}`;
                      printedVideos.push(`${movieName} - Part 1`);
                    }
                  } else {
                    displayName = Videolink; // Fallback if no name is available
                  }
  
                  return (
                    <li key={videoIndex}>
                      <a href={Videolink} target="_blank" rel="noopener noreferrer">
                        {displayName}
                      </a>
                      <br/>
                    </li>
                  );
                })}
            </ul>
            <button onClick={(event) => downloadAllVideos(event, scheduler)}>Download All</button>
          </div>
        </div>
      );
    });
};
  

//   const renderSchedulerPlaylist = () => {

//     if (!schedulerData || schedulerData.length === 0) {
//       return <p>No scheduler data available.</p>;
//     }  
//   return schedulerData.map((scheduler, index) => (
//     <div key={index} className="nested-scheduler-container">
//       <div className="scheduler-playlist-item">
//         <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.premiereDate).toDateString()}`}</h3>
//         <ul>
//         {JSON.parse(scheduler.videoLinks)
//           .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
//           .map((videoLink, videoIndex) => {
//             const linkKey = Object.keys(videoLink)[0]; // Get the key of the video link
//             const linkValue = Object.values(videoLink)[0]; // Get the value of the video link
//             return (
//               <li key={videoIndex}>
//                 <a href={linkValue} target="_blank" rel="noopener noreferrer">
//                   {`${linkKey}: ${linkValue}`}
//                 </a>
//                 <br/>
//                {/* {renderDownloadStatusIcon(videoIndex)}  Render download status icon */}
//               </li>
//             );
//           })}
//         </ul>
//         <button onClick={(event) => downloadAllVideos(event, scheduler)}>Download All</button>
//       </div>
//     </div>
//   ));
// };

  return (
    <>
      <h1>Operator Playlist</h1>
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};