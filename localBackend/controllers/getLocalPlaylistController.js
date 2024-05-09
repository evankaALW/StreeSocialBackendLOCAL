const connectionLocal = require('../config/localdb');

const getPlaylistLocalDetails = {
    getPlaylistLocalData : async (req,res) =>{
        try{
            const getQuery = `SELECT * FROM playlistTable`;

            const result = await connectionLocal.query(getQuery);
    
            if(result[0]){
                return res.status(200).json({playlistData: result[0]});
            }
            else{
                return res.status(401).json({message: "Data not found in playlistTable"});
            }
        }catch(error){
            return res.status(500).json({error:error});
        }
        
    }
};

module.exports = getPlaylistLocalDetails;