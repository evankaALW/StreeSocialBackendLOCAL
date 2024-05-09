const http = require('http');
const https = require('https');
const fs = require('fs');
const connectionLocal = require('../config/localdb')


const downloadPlaylistDetails = {
  downloadPlaylistData: async (req, res) => {
    try{
    const {videoLinks,screenID,slotIndex,movieID,isDeleted,date, time,screenNo} = req.body;
    const newVideoLinks = JSON.stringify(videoLinks);
    const dateString = '' + date;
    const dateDatabase = (new Date(dateString)).toISOString().split('T')[0];

    const selectLocalQuery = `SELECT * FROM playlistTable WHERE screenID = ${screenID} AND movieID=${movieID} AND slotIndex = ${slotIndex} and dateOfPremiere = '${dateDatabase} 00:00:00'`;

    const selectResult = await connectionLocal.query(selectLocalQuery);
    
    if(selectResult[0][0]){

      const updateQuery = `UPDATE playlistTable set videoLinks='${newVideoLinks}' where id=${selectResult[0][0].id}`
      const updateResult = await connectionLocal.query(updateQuery);
      if(updateResult)
        {
          console.log(selectResult[0])
          return res.status(200).json({message:"Playlist already exists, updated it in the local database"});
        }
      
    }
    else{
      const insertLocalQuery = `INSERT INTO playlistTable (screenID, screenNo, slotIndex, dateOfPremiere, timeOfPremiere, videoLinks, movieID, isDeleted, createdAt, updatedAt)
      VALUES (${screenID}, ${screenNo}, ${slotIndex}, '${dateDatabase}', '${time}', '${newVideoLinks}', ${movieID}, ${isDeleted}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))`;
  
      const result = await connectionLocal.query(insertLocalQuery);
      if(result){
        return res.status(200).json({message:"Download playlist into Local table successful"});
      }
    }
  }catch(error){
    return res.status(200).json({error:error});
  }
  }
};

module.exports = downloadPlaylistDetails;