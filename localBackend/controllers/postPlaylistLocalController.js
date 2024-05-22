const http = require('http');
const https = require('https');
const fs = require('fs');
const connectionLocal = require('../config/localdb')
const connection = require('../config/db')



const downloadPlaylistDetails = {
  downloadPlaylistData: async (req, res) => {
    try{
      const {schedulerData}=req.body;
      schedulerData.newVideoLinks = schedulerData.videoLinks;
      let responseMessage = '';
      var updateResult = '';
      var insertResult = '';
      var questionResult = 0;
      const dateString = '' + schedulerData.premiereDate;
      const dateDatabase = (new Date(dateString)).toISOString().split('T')[0];

      const selectLocalQuery = `SELECT * FROM playlistTable WHERE screenID = ${schedulerData.screenID} AND movieID=${schedulerData.movieID} AND slotIndex = ${schedulerData.slotIndex} and dateOfPremiere = '${dateDatabase} 00:00:00' and timeOfPremiere = '${schedulerData.premiereTime}'`;
      const selectResult = await connectionLocal.query(selectLocalQuery);
    if(selectResult[0].length > 0){
      const updateQuery = `UPDATE playlistTable set videoLinks='${schedulerData.newVideoLinks}', videoLinksSize = '${schedulerData.videoLinksSize}' where id=${selectResult[0][0].id}`;
      updateResult = await connectionLocal.query(updateQuery);
      responseMessage = responseMessage + "Update existing playlist successful!";
    }
    else{
      const insertLocalQuery = `INSERT INTO playlistTable (screenID, screenNo, slotIndex, dateOfPremiere, timeOfPremiere, videoLinks, videoLinksSize, movieID, isDeleted, createdAt, updatedAt)
      VALUES (${schedulerData.screenID}, ${schedulerData.screenNo}, ${schedulerData.slotIndex}, '${dateDatabase}', '${schedulerData.premiereTime}', '${schedulerData.newVideoLinks}', '${schedulerData.videoLinksSize}', ${schedulerData.movieID}, ${schedulerData.isDeleted}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))`;
      insertResult = await connectionLocal.query(insertLocalQuery);
      responseMessage = responseMessage + "Insert new playlist successful!";
    }

    if(insertResult || updateResult){
      schedulerData.videoLinks = JSON.parse(schedulerData.newVideoLinks);
      schedulerData.videoLinksSize = JSON.parse(schedulerData.videoLinksSize);
      for (let i = 0; i < schedulerData.videoLinks.length; i++) {//for (const videoLinkObj of (JSON.parse(schedulerData.videoLinks))) {
        const videoLinkObj = schedulerData.videoLinks[i];
        const videoLink = videoLinkObj.Videolink;
        const videoLinkSizeObj = schedulerData.videoLinksSize[i];
        const videoLinkSize = videoLinkSizeObj && Object.values(videoLinkSizeObj)[0] || null;//const videoLinkSize = videoLinkSizeObj ? (videoLinkSizeObj.MovieOnesize || videoLinkSizeObj.size|| videoLinkSizeObj.MovieTwosize || null) : null;
        console.log(videoLinkObj,"videoLinkSizeObj",videoLinkSize,videoLinkSizeObj)
        if (videoLink && videoLinkSize) {
          console.log("videoLink && videoLinkSize")
          // Query to check advertisement
          const adQuery = `SELECT * FROM advertisementLocalTable WHERE adVideoLink = '${videoLink}' and adFileSize = ${videoLinkSize}`;
          const [adResult] = await connectionLocal.query(adQuery);
          console.log(adResult)
          if (adResult.length === 0) {// Check if videoLink exists in schedulerData
            if (schedulerData[videoLink]) {
              const adData = schedulerData[videoLink].advertisement;
              const questions = schedulerData[videoLink].questions;

              if (questions) {
                for (const question of questions) {
                  const questionInsertQuery = `INSERT INTO questionLocalTable (questionDescription, optionOne, optionTwo, optionThree, optionFour, optionFive, imageURL, font, imageName, correctOption, padx1, padx2, padx3, padx4, padx5, x1, x2, x3, x4, x5, pady1, pady2, pady3, pady4, pady5, y1, y2, y3, y4, y5, createdAt, updatedAt)
                    VALUES ('${question.questionDescription}', '${question.optionOne}', '${question.optionTwo}', '${question.optionThree}', '${question.optionFour}', '${question.optionFive}', '${question.imageURL}', '${question.font}', '${question.imageName}', '${question.correctOption}', ${question.padx1}, ${question.padx2}, ${question.padx3}, ${question.padx4}, ${question.padx5}, ${question.x1}, ${question.x2}, ${question.x3}, ${question.x4}, ${question.x5}, ${question.pady1}, ${question.pady2}, ${question.pady3}, ${question.pady4}, ${question.pady5}, ${question.y1}, ${question.y2}, ${question.y3}, ${question.y4}, ${question.y5}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))`;
                    questionResult = await connectionLocal.query(questionInsertQuery);
                    console.log("questionResult success",questionResult)
                }
              }
              if (adData) {

                const adInsertQuery = `INSERT INTO advertisementLocalTable (adVideoLink, adFileSize, totalOptionNumber, questionTableID, userResponseToggle, displayToggle, brandName, duration, adStartTime, isSample, isDeleted, createdAt, updatedAt)
                  VALUES ('${adData.adVideoLink}', ${adData.adFileSize}, ${adData.totalOptionNumber}, ${questionResult[0]}, ${adData.userResponseToggle}, ${adData.displayToggle},'${adData.brandName}', ${adData.duration}, ${adData.adStartTime}, ${adData.isSample}, ${adData.isDeleted}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))`;
                await connectionLocal.query(adInsertQuery);
                console.log("adInsertQuery success")
              }

              else{
                    const movieSelectQuery = `SELECT * FROM movieLocalTable where (movieURLPartOne = '${videoLink}' and movieURLPartOneSize = ${videoLinkSize}) or (movieURLPartTwo = '${videoLink}' and movieURLPartTwoSize = ${videoLinkSize})`;//`SELECT * FROM movieLocalTable WHERE movieURLPartOne = '${movieDetails.movieURLPartOne}' AND movieURLPartTwo = '${movieDetails.movieURLPartTwo}'`;
                    const [movieSelectResult] = await connectionLocal.query(movieSelectQuery);

                    if(movieSelectQuery.length === 0){
                      if (schedulerData[videoLink]) {

                        const movieData = schedulerData[videoLink].movie;
                        if(movieData){

                    //       const movieQuery = `SELECT * FROM movieLocalTable where (movieURLPartOne = '${videoLink}' and movieURLPartOneSize = ${videoLinkSize}) or (movieURLPartTwo = '${videoLink}' and movieURLPartTwoSize = ${videoLinkSize})`;//`SELECT * FROM movieLocalTable WHERE movieURLPartOne = '${movieDetails.movieURLPartOne}' AND movieURLPartTwo = '${movieDetails.movieURLPartTwo}'`;
                    // const [movieResult] = await connectionLocal.query(movieQuery);

                    // if (movieResult.length === 0) {
                    const movieData = schedulerData[videoLink].movie;

                    // Insert into movieTable if movieData exists
                    if (movieData) {
                      const movieDate = (new Date('' + movieData.dateTime)).toISOString().split('T')[0];
                      const startDate = (new Date('' + movieData.startDate)).toISOString().split('T')[0];
                      const endDate = (new Date('' + movieData.endDate)).toISOString().split('T')[0];

                      const movieInsertQuery = `
                        INSERT INTO movieLocalTable (movieID, movieName, movieDesc, movieURLPartOne, movieURLPartOneSize, movieURLPartTwo, movieURLPartTwoSize, movieRuntime, intervalTime, productionHouse, dateAndTime, startDate, endDate, posterImage, displayToggle, userResponseToggle, isDeleted, isExpired, createdAt, updatedAt)
                        VALUES (${movieData.movieID}, '${movieData.movieName}', '${movieData.movieDesc}', '${movieData.movieURLPartOne}', ${movieData.movieURLPartOneSize}, '${movieData.movieURLPartTwo}', ${movieData.movieURLPartTwoSize}, ${movieData.movieRuntime}, ${movieData.intervalTime}, '${movieData.productionHouse}', '${movieDate}', '${startDate}', '${endDate}', ${movieData.posterImage ? `'${movieData.posterImage.data}'` : 'NULL'}, ${movieData.displayToggle}, ${movieData.userResponseToggle}, ${movieData.isDeleted}, ${movieData.isExpired}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))
                      `;
                      await connectionLocal.query(movieInsertQuery);
                      console.log("movieInsertQuery success")
                            }
                        //}
                      }
                  }
                }
              }
            }
          }
        }
      }
      return res.status(200).json({ message: responseMessage });
    }  
  }catch(error){
    return res.status(500).json({error:error});
  }
  }
};

module.exports = downloadPlaylistDetails;