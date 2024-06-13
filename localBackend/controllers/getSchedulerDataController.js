const connection = require('../config/db');

const getSchedulerData = {
    schedulerData: async (req, res) => {
        try {
            const { theatreid } = req.params;
            const query = `SELECT sd.id, sd.screenID, st.screenNo, sd.premiereDate, sd.premiereTime, sd.slotIndex, sd.videoLinks, sd.videoLinksSize, sd.videoLinksAndName, sd.movieID, sd.advertisementIDList, sd.isDeleted FROM schedulerTable AS sd JOIN 
            screenTable AS st ON sd.screenID = st.id WHERE sd.theatreID = ${theatreid}`;
            const scheduler = await connection.query(query);

            if (scheduler[0]) {
                for (let i = 0; i < scheduler[0].length; i++) {
                    const videoLinks = JSON.parse(scheduler[0][i].videoLinks);

                    for (const videoLink of videoLinks) {
                        const videolinkValue = videoLink.Videolink;

                        if (videolinkValue && videolinkValue.trim() !== '') {
                            // Execute query to select from ADVERTISEMENTTABLE
                            const selectQuery = `SELECT a.*, b.brandName FROM advertisementTable a JOIN brandTable b ON a.brandID = b.id WHERE a.adVideoLink = '${videolinkValue}'`;
                            const selectRes = await connection.query(selectQuery);

                            if (selectRes[0].length > 0) {
                                const questionID = selectRes[0][0].questionTableID;
                                // Execute query to select from QUESTIONTABLE
                                const selectQuestionQuery = `SELECT * FROM questionTable WHERE id = ${questionID}`;
                                const resQuestion = await connection.query(selectQuestionQuery);

                                // Append the results to scheduler[0][i] object
                                scheduler[0][i][videolinkValue] = {
                                    advertisement: selectRes[0][0],
                                    questions: resQuestion[0]
                                };
                            }
                            else if(selectRes[0].length === 0){

                                const selectMovieQuery = `select * from movieTable where (movieURLPartOne = '${videolinkValue}' ) or ( movieURLPartTwo = '${videolinkValue}')`;
                                const selectMovieRes = await connection.query(selectMovieQuery);

                                if(selectMovieRes[0].length> 0){
                                    
                                    scheduler[0][i][videolinkValue] = {
                                        movie : selectMovieRes[0][0]
                                    };
                                }
                            }
                        }
                    }
                }

                return res.status(200).json({ schedulerDetails: scheduler[0] });
            }
        } catch (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ error: 'Error retrieving data from schedulerTable' });
        }
    }
};

module.exports = getSchedulerData;
