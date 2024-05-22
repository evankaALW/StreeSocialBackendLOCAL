const {DataTypes} = require("sequelize")
const seque = require('../config/localdb');

//											
const movieLocalTable = seque.define('movieLocalTable', {
    movieID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    movieName:{
        type:DataTypes.TEXT('long'),
    },
    movieDesc:{
        type:DataTypes.TEXT('long'),
    },
    movieURLPartOne:{
        type:DataTypes.TEXT('long'),
    },
    movieURLPartOneSize:{
        type:DataTypes.DOUBLE,
    },
    movieURLPartTwo:{
        type:DataTypes.TEXT('long'),
    },
    movieURLPartTwoSize:{
        type:DataTypes.DOUBLE,
    },
    movieRuntime:{
        type:DataTypes.DOUBLE,
    },
    intervalTime:{
        type:DataTypes.DOUBLE,
    },
    productionHouse:{
        type:DataTypes.STRING,
    },
    dateAndTime:{
        type:DataTypes.DATE,
    },
    startDate:{
        type: DataTypes.DATE,
    },
    endDate:{
        type: DataTypes.DATE,
    },
    posterImage:{
        type:DataTypes.BLOB,
    },
    displayToggle:{
        type:DataTypes.INTEGER,
    },
    userResponseToggle:{
        type:DataTypes.INTEGER,
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
      },
      isExpired:{
        type:DataTypes.BOOLEAN,
      }
},
{
  tableName: 'movieLocalTable'
});

seque.sync().then(() =>{
    console.log("movieLocalTable table successfully created")
}).catch((error) =>{
    console.log("Error while creating movieLocalTable", error)
});


module.exports = movieLocalTable;
