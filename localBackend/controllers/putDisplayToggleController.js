const connection = require('../config/db'); // Assuming you have a database configuration file
const putDisplayToggleController = {};

putDisplayToggleController.putDisplayToggle = async (req,res) =>
{
    try {
        const {advertisementID, displayToggle, userResponseToggle} = req.body;
        const query = `UPDATE advertisementLocalTable SET displayToggle = CASE WHEN id = ${advertisementID} THEN ${displayToggle} ELSE displayToggle END, userResponseToggle = ${userResponseToggle}`;
        const results = await connection.query(query);
    
        console.log('displayToggle, userResponseToggle updated successfully');
        if(results){
          return res.status(200).json({results});
        }
      } catch (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ error: 'displayToggle, userResponseToggle NOT updated successfully' });
      }
};

module.exports = putDisplayToggleController;

