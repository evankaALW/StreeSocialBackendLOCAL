import React from 'react';
import {Routes, Route } from "react-router-dom";
import { VideoPlayer } from '../components/videoPlayer.js';
import { VideoPlaylist } from '../components/videoPlaylist.js';
import {ShowVideoPlaylist} from '../components/showVideoPlaylist.js';
import ClickerAssignForm from '../components/clickerAssignForm.js';
// import RegistrationForm from './components/registartionForm.js';

export const Allroutes = () => {

  return (
    <div>
      <Routes>
          <Route path="videoPlayer" element={<VideoPlayer/>} />   
          <Route path="videoPlaylist" element={<VideoPlaylist/>} />
          <Route path="showVideoPlaylist" element={<ShowVideoPlaylist/>} />
          <Route path="clickerAssignForm" element={<ClickerAssignForm/>} />
      </Routes>


    </div>
  )
}