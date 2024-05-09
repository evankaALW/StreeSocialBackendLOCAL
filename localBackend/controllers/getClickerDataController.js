const connectionLocal = require('../config/localdb');

const getClickerDetails = {
    getClickerData : async (req,res) =>{
        try{
            const getQuery = `SELECT * FROM clickerDeviceDetailsTable`;

            const result = await connectionLocal.query(getQuery);
    
            if(result[0]){
                return res.status(200).json({clickerDeviceDetailsTable: result[0]});
            }
            else{
                return res.status(401).json({message: "Data not found in clickerDeviceDetailsTable"});
            }
        }catch(error){
            return res.status(500).json({error:error});
        }
        
    }
};

module.exports = getClickerDetails;