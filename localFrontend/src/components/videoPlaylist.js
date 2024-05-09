
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/videoPlaylist.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;


export const VideoPlaylist = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [downloadInitiate, setDownloadInitiate] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState();
  const [localParentFolderURL, setLocalParentFolderURL] = useState('');
  const [liveParentFolderURL, setLiveParentFolderURL] = useState('');

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

  const handlePlayButtonClick = (scheduler) => { // Extract video links from the scheduler
    console.log("scheduler",scheduler)
    console.log("scheduler.video_links",JSON.parse(scheduler.videoLinks))
    console.log(" type of scheduler.video_links",typeof(scheduler.videoLinks))
    if(scheduler.videoLinks){
    var validVideoLinks = (JSON.parse(scheduler.video_links))
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);
    console.log("validVideoLinks",validVideoLinks)
    }
   
      const myArray = Object.values(validVideoLinks);//convert object of values - link to array of links

   localStorage.setItem('videoLinks', JSON.stringify(myArray));
  
    // Redirect to the video player page
  window.location.href = 'video-player'; // Change the path as needed*/}
  };

  // const downloadAllVideos = async (videoObject) => {
  //   const startDate = videoObject.startDate.replace(/[^\w\s]/gi, '');
  //   const downloadPath = `D:\\streesocial_new_LIVE01042024\\STREESOCIAL_FRONTEND\\public\\videos\\videosTesting\\`;
  //   const jsonData = JSON.parse(videoObject.videoLinks);
  //   const filteredData = jsonData.filter(item => item.Videolink !== "" && item.Videolink !== null);
  
  //   try {
  //     // Map each link to an axios request
  //     const downloadPromises = filteredData.map((link, index) => {
  //       const linkKey = Object.keys(link)[0];
  //       const linkValue = Object.values(link)[0];
  //       const fileName = linkValue;
  
  //       return axios.get(`${apiUrl}/getFileDownloadOption`, {
  //         params: {
  //           videoURL: fileName,
  //           liveFileServerURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/',
  //           localFileParentURL: downloadPath,
  //         }
  //       });
  //     });
  
  //     // Wait for all axios requests to complete
  //     const responses = await Promise.all(downloadPromises);
  
  //     // Handle the responses
  //     responses.forEach(response => {
  //       alert(response.data.download);
  //     });

  //     //download playlist file paths from live db to local db

  
  //   } catch (error) {
  //     console.error('Error downloading videos:', error);
  //   }
  // };
  

  const downloadAllVideos = async (videoObject) => {
        const startDate = videoObject.premiereDate.replace(/[^\w\s]/gi, '');
        const downloadPath = `D:\\streesocial_new_LIVE01042024\\STREESOCIAL_FRONTEND\\public\\videos\\`;
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
    // Make POST request synchronously
    const res = await axios.post(`${apiUrl}/downloadPlaylistToLocal`, {
      videoLinks: filteredData,
      screenID: videoObject.screenID,
      slotIndex: videoObject.slotIndex,
      movieID: videoObject.movieID,
      isDeleted: videoObject.isDeleted,
      date: videoObject.premiereDate,
      time: videoObject.premiereTime,
      screenNo: videoObject.screenNo,
    });
    
      console.log(res);
      alert(res.data.message);
    
  } catch (error) {
    console.error('Error downloading playlist:', error);
    alert('Error downloading playlist');
  }

 };

  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);

    // Redirect to the video URL in the same tab
    window.location.href = videoUrl;
  };


  const renderSchedulerPlaylist = () => {

    if (!schedulerData || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }  
    // //swapnil code eliminate duplicate data
    // // Flatten the nested arrays
    // const flattenedSchedulerData = schedulerData.schedulerDetails.flat();

    // // Use a Set to eliminate duplicates based on scheduler_id
    // const uniqueSchedulers = Array.from(new Set(flattenedSchedulerData.map(scheduler => scheduler.id)))
    //   .map(schedulerId => flattenedSchedulerData.find(scheduler => scheduler.id === schedulerId));

    //   console.log("uniqueSchedulers",uniqueSchedulers);
    //   console.log("type of data",typeof(uniqueSchedulers[0].videoLinks))
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
              </li>
            );
          })}
        </ul>
        {/* <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button> */}
        {/* <button>Play All</button> */}
        <button onClick={() => downloadAllVideos(scheduler)}>Download All</button>
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