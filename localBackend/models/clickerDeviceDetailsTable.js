const {DataTypes} = require("sequelize")
const seque = require('../config/localdb')

const clickerDeviceDetailsTable = seque.define('clickerDeviceDetailsTable', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    screenID:{
        type:DataTypes.INTEGER,
    },
    IPAddress:{
        type:DataTypes.STRING(200),
    },
    seatNo:{
        type:DataTypes.TEXT,
    },
    isReplaced:{
        type:DataTypes.BOOLEAN,
    },
    dateTime:{
        type:DataTypes.DATE,
    },
    issueIfReplaced:{
        type:DataTypes.TEXT('medium'),
    },
    macAddress:{
        type:DataTypes.STRING(200),
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
      }
},
{
  tableName: 'clickerDeviceDetailsTable'
});
 
seque.sync().then(() =>{
    console.log("clickerDeviceDetailsTable table successfully created")
}).catch((error) =>{
    console.log("Error while creating clickerDeviceDetailsTable", error)
});

module.exports = clickerDeviceDetailsTable;
