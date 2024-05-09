const connection = require('../config/db'); // Assuming you have a database configuration file
const postUserResponseController = {}

postUserResponseController.postUserResponse = async(req,res) =>
{
    try {
        const { userName, phoneNumber, cardID, ad_ID, optionSelected, videoDataID } = req.body;

            const selectQuery = `SELECT id FROM userData WHERE userName = '${userName}' AND phoneNumber = ${phoneNumber} AND cardID = '${cardID}'  ORDER BY dateAndTime DESC LIMIT 1`;
            const selectResult = await connection.query(selectQuery);
            if(selectResult.length>0){

                finalUserID = selectResult[0][0].userID;//?
                const insertResponseQuery =`INSERT INTO userresponsetable (id, userID, ad_ID, optionSelected, dateTime,createdAt,updatedAt) VALUES (null, ${finalUserID}, ${ad_ID}, '${optionSelected}', NOW(),NOW(),NOW())`;

                const responseResult = await connection.query(insertResponseQuery);

                if(responseResult){
                    return res.status(200).send('RESPONSE 200 OK');
                }
            }
        
    }catch(error)
    {
        console.log(error);
    }
};

module.exports = postUserResponseController;