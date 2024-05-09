const connectionLocal = require('../config/localdb');

 const postClickerDetails = {
    clickerData : async (req,res) => {
        try{
            const {screenID, IPAddress, seatNo, isReplaced, dateTime, issueIfReplaced, macAddress, isDeleted} = req.body;

            const clickerQuery = `INSERT INTO clickerDeviceDetailsTable (screenID, IPAddress, seatNo, isReplaced, dateTime, issueIfReplaced, macAddress, isDeleted, createdAt, updatedAt)
            VALUES ( ${screenID}, '${IPAddress}', '${seatNo}', ${isReplaced}, NOW(), '${issueIfReplaced}', '${macAddress}', ${isDeleted}, CONVERT_TZ(NOW(), '+00:00', '+05:30'), CONVERT_TZ(NOW(), '+00:00', '+05:30'))`;

            const result = await connectionLocal.query(clickerQuery);

            if(result){
                return res.status(200).json({message:"Post into clicker successful"});
            }
        }
        catch(error)
        {
            return res.status(500).json({message:error});
        }
    }
};
module.exports = postClickerDetails;

