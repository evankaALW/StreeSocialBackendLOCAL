const allVideoDetailsController = {}
const connection = require('../config/db')

allVideoDetailsController.getAllVideoDetails = async  (req,res) =>{     
try{
     const finalResults = {};
     const getMovieQuery = `SELECT * FROM movieTable`;

     const resultMovie = await connection.query(getMovieQuery);

     if(resultMovie[0]) {
          finalResults.movie = resultMovie[0];
            //res.status(200).json({ finalResults });
    } else {
          finalResults.movie = [];//res.status(404).json({ error: 'No videos found from movieTable' });
      }
    
     const advertsiementQuery = `SELECT  m.id AS ad_id, m.adVideoLink, m.totalOptionNumber, m.userResponseToggle, 
     m.displayToggle, m.duration, m.adStartTime, m.isSample, m.isDeleted,
     q.id AS question_id, q.questionDescription, q.optionOne, q.optionTwo, q.optionThree, q.optionFour, q.optionFive, q.imageURL, q.font, q.correctOption, 
     q.padx1, q.padx2, q.padx3, q.padx4, q.padx5, q.x1, q.x2, q.x3, q.x4, q.x5, q.pady1, q.pady2, q.pady3, q.pady4, q.pady5, q.y1, q.y2, q.y3, q.y4, q.y5
FROM advertisementTable m 
INNER JOIN questiontable q ON m.questionTableID = q.id`;
     const result = await connection.query(advertsiementQuery)
     if(result[0]) {
          finalResults.advertisements = result[0];//const resultsTwo = result[0];
             //res.status(200).json({ resultsTwo });
    } else {
            finalResults.advertisements = [];//res.status(404).json({ error: 'No videos found' });
      }
           res.status(200).json(finalResults);
       }
  catch(error){
    console.log("error in allVideoDetails fetch", error);
    res.status(500).json({ error: 'Internal server error' });
  }         
 };


 module.exports = allVideoDetailsController;

  