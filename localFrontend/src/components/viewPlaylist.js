import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/videoPlayer.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;

export const ViewPlaylist = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => { // Fetch scheduler data from the backend API using axios
    axios.get(`${apiUrl}/getPlaylistLocal`)
      .then(response => {
        setPlaylistData(response.data.playlistData);
        console.log("Response", response);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

  const hasPartOnePrinted = (movieName, printedVideos) => {
    return printedVideos.includes(`${movieName} - Part 1`);
  };

  const handlePlayButtonClick = (playlist) => {
    console.log('handlePlayButtonClick called with playlist:', playlist);
    console.log('Playlist clicked:', playlist);
    var validVideoLinks = JSON.parse(playlist.videoLinks)
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);
  
    const myArray = Object.values(validVideoLinks); // Convert object of values - link to array of links
    console.log("myArray", myArray);
  
    localStorage.setItem('videoLinks', JSON.stringify(myArray));
    console.log('Video links set in local storage:', myArray);
    if(myArray){
      setTimeout(() => {
        console.log('Navigating to videoPlayer...');
        window.location.href = 'videoPlayer';
      }, 100); // 
      // Redirect to the video playlist page
    }
   
  };


  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('videoLinks'));
    console.log('Stored video links:', storedLinks);
  }, []);
  

  const renderLocalPlaylist = () => {
    if (!playlistData || playlistData.length === 0) {
      return <p>No playlist data available in the local db.</p>;
    }

    const flattenedplaylistData = playlistData.flat();
    const uniquePlaylistData = Array.from(new Set(flattenedplaylistData.map(playlist => playlist.id)))
      .map(id => flattenedplaylistData.find(playlist => playlist.id === id));

    console.log("uniquePlaylistData", uniquePlaylistData);
    console.log("type of data", typeof(uniquePlaylistData[0].videoLinks));

  return playlistData.map((playlist, index) => {
    const printedVideos = []; // To track printed video parts

    return (
      <div key={index} className="nested-scheduler-container">
        <div className="scheduler-playlist-item">
          <h3>{`Local Playlist ${playlist.slotIndex} - Screen - ${playlist.screenNo} ; ${new Date(playlist.dateOfPremiere).toDateString()}`}</h3>
          <ul>
            {JSON.parse(playlist.videoLinks)
              .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
              .map((videoLink, videoIndex) => {
                const linkKey = Object.keys(videoLink)[0]; // Get the key of the video link
                const linkValue = Object.values(videoLink)[0]; // Get the value of the video link
                const videoNameObj = JSON.parse(playlist.videoLinksAndName).find(v => v.Videolink === linkValue);
                
                let displayName = linkValue; // Default to the video link
                if (videoNameObj) {
                  const { videoName, advertisementName } = videoNameObj;
                  if (advertisementName) {
                    displayName = `${advertisementName}: ${linkValue}`;
                  } else if (videoName) {
                    const movieName = videoName.split(' - Part ')[0];
                    if (hasPartOnePrinted(movieName, printedVideos)) {
                      displayName = `${movieName} - Part 2: ${linkValue}`;
                      printedVideos.push(`${movieName} - Part 2`);
                    } else {
                      displayName = `${movieName} - Part 1: ${linkValue}`;
                      printedVideos.push(`${movieName} - Part 1`);
                    }
                  }
                }

                return (
                  <li key={videoIndex}>
                    <a href={linkValue} target="_blank" rel="noopener noreferrer">
                      {displayName}
                    </a>
                    <br/>
                  </li>
                );
              })}
          </ul>
          <button onClick={() => handlePlayButtonClick(playlist)}>Play All</button>
        </div>
      </div>
    );
  });
};

  return (
    <>
      <h1>Operator Playlist</h1>
      <div className="scheduler-playlist-wrapper">
        {renderLocalPlaylist()}
      </div>
    </>
  );
};
