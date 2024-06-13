import React from 'react';
import {Routes, Route } from "react-router-dom";
import { DownloadPlaylist } from '../components/downloadPlaylist.js';
import { ViewPlaylist } from '../components/viewPlaylist.js';
import {VideoPlayer} from '../components/videoPlayer.js';
import ClickerAssignForm from '../components/clickerAssignForm.js';
// import RegistrationForm from './components/registartionForm.js';

export const Allroutes = () => {

  return (
    <div>
      <Routes>
          <Route path="downloadPlaylist" element={<DownloadPlaylist/>} />   
          <Route path="viewPlaylist" element={<ViewPlaylist/>} />
          <Route path="videoPlayer" element={<VideoPlayer/>} />
          <Route path="clickerAssignForm" element={<ClickerAssignForm/>} />
      </Routes>


    </div>
  )
}