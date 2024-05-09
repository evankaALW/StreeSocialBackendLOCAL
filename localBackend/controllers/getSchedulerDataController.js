const connection = require('../config/db');

const getSchedulerData = {
    schedulerData : async (req, res) => {
        try{
            const {theatreid} = req.params;
            const query = `SELECT sd.id, sd.screenID, st.screenNo, sd.premiereDate, sd.premiereTime, sd.slotIndex, sd.videoLinks, sd.movieID, sd.advertisementIDList, sd.isDeleted FROM schedulerTable AS sd JOIN 
            screenTable AS st ON sd.screenID = st.id WHERE sd.theatreID = ${theatreid}`;
            const scheduler = await connection.query(query);
            if(scheduler[0])
            {
                console.log("scheduler",scheduler)
                return res.status(200).json({schedulerDetails: scheduler[0]})
            }
        }
        catch (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ error: 'Error retrieving data from schedulerTable' });
          }}
};

module.exports = getSchedulerData;