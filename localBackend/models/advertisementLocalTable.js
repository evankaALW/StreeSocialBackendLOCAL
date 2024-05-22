const { DataTypes } = require("sequelize");
const seque = require('../config/localdb');
const questionLocalTable = require('./questionLocalTable');

const advertisementLocalTable = seque.define('advertisementLocalTable', {
    id: { // videoadid
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    adVideoLink: {
        type: DataTypes.TEXT('medium'),
    },
    adFileSize: {
        type: DataTypes.BIGINT,
    },
    totalOptionNumber: { 
        type: DataTypes.INTEGER,
    },
    questionTableID: { // fk
        type: DataTypes.INTEGER,
    },
    userResponseToggle: {
        type: DataTypes.INTEGER,
    },
    displayToggle: {
        type: DataTypes.INTEGER,
    },
    brandIDLive: {
        type: DataTypes.INTEGER,
    },
    brandName: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    adStartTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isSample: {
        type: DataTypes.BOOLEAN,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
    }
}, {
    tableName: 'advertisementLocalTable'
});

advertisementLocalTable.belongsTo(questionLocalTable, { foreignKey: 'questionTableID', onUpdate: 'NO ACTION', onDelete: 'CASCADE' });

seque.sync().then(() => {
    console.log("advertisementLocalTable table successfully created");
}).catch((error) => {
    console.log("Error while creating advertisementLocalTable", error);
});

module.exports = advertisementLocalTable;