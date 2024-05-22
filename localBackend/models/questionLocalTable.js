const {DataTypes} = require("sequelize")
const seque = require('../config/localdb');



const questionLocalTable = seque.define('questionLocalTable', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    questionDescription:{
        type:DataTypes.TEXT('long'),
       
    },
    optionOne:{
        type:DataTypes.STRING,
       
    },
    optionTwo:{
        type:DataTypes.STRING,
       
    },optionThree:{
        type:DataTypes.STRING,
       
    },optionFour:{
        type:DataTypes.STRING,
       
    },optionFive:{
        type:DataTypes.STRING,
       
    },
    imageURL:{
        type:DataTypes.TEXT('long'),
    },
    font:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    imageName:{
        type:DataTypes.TEXT,
    },
    correctOption:{
        type:DataTypes.STRING,
    },
    padx1:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
    },
    padx2:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
    },
    padx3:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
    padx4:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
    },
    padx5:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
    x1:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      x2:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      x3:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      x4:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      x5:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
    pady1:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
    pady2:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      pady3:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      pady4:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      pady5:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      y1:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      y2:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      y3:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      y4:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      },
      y5:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
      }
},
{
  tableName: 'questionLocalTable' // specify the exact table name
});

seque.sync().then(() =>{
    console.log("questionLocalTable table successfully created")
}).catch((error) =>{
    console.log("Error while creating questionLocalTable", error)
});

module.exports=questionLocalTable;