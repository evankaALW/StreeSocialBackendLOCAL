import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to='videoPlaylist'>
        <h3>Video Playlist</h3>
      </Link>
      <Link to='videoPlayer'>
        <h3>Video Player</h3>
      </Link>
      <Link to='clickerAssignForm'>
      <h3>Clicker Assign Form</h3>
      </Link> 
    </div>
  );
};