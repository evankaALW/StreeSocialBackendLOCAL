const {DataTypes} = require("sequelize")
const seque = require('../config/localdb')

const playlistTable = seque.define('playlistTable', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    screenID:{
        type:DataTypes.INTEGER,
    },
    startDate:{
        type:DataTypes.DATE,
    },
    slotIndex:{
        type:DataTypes.INTEGER,
    },
    dateOfPremiere:{
        type:DataTypes.DATE,
    },
    timeOfPremiere:{
        type:DataTypes.TIME,
    },
    videoLinks:{
        type:DataTypes.TEXT,
    },
    movieID:{
        type:DataTypes.INTEGER,
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
      }
},
{
  tableName: 'playlistTable'
});
//schedulerTable.belongsTo(screenTable,{ foreignKey: 'screenID' , onUpdate: 'NO ACTION',onDelete: 'CASCADE'});
seque.sync().then(() =>{
    console.log("playlistTable table successfully created")
}).catch((error) =>{
    console.log("Error while creating playlistTable", error)
});

module.exports = playlistTable;
