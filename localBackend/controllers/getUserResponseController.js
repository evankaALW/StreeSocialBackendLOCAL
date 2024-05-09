const connection = require('../config/db');

const getUserResponse = {
    userResponseData : async (req, res) => {
        try{ 
            const query = 'SELECT * FROM userResponseTable';
            const result = await connection.query(query);
            if(result)
            {
                console.log("userResponseTable",result)
                return res.status(200).json({"userResponseTable": result})
            }
        }
        catch (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ error: 'Error retieving data from userResponseTable' });
          }}
};

module.exports = getUserResponse;