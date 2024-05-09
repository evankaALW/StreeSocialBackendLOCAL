import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/videoPlayer.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;

export const VideoPlayer = () => {
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
        console.log('Navigating to showVideoPlaylist...');
        window.location.href = 'showVideoPlaylist';
      }, 1000); // 
      // Redirect to the video playlist page
    }
   
  };

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('videoLinks'));
    console.log('Stored video links:', storedLinks);
  }, []);
  

  const renderLocalPlaylist = () => {
    if (!playlistData || playlistData.length === 0) {
      return <p>No scheduler data available.</p>;
    }

    const flattenedplaylistData = playlistData.flat();
    const uniquePlaylistData = Array.from(new Set(flattenedplaylistData.map(playlist => playlist.id)))
      .map(id => flattenedplaylistData.find(playlist => playlist.id === id));

    console.log("uniquePlaylistData", uniquePlaylistData);
    console.log("type of data", typeof(uniquePlaylistData[0].videoLinks));

    return uniquePlaylistData.map((playlist, index) => (
      <div key={index} className="nested-scheduler-container">
        <div className="scheduler-playlist-item">
          <h3>{`Local Playlist ${playlist.slotIndex} - Screen - ${playlist.screenNo} ; ${new Date(playlist.dateOfPremiere).toDateString()}`}</h3>
          <ul>
            {JSON.parse(playlist.videoLinks)
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
          <button onClick={() => handlePlayButtonClick(playlist)}>Play All</button>
        </div>
      </div>
    ));
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
