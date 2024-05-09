const { Sequelize } = require('sequelize');
const seque = new Sequelize(
    'streesocialmasterdb',
    'root',
    'Abc#12345',
    {
        host : 'localhost',
        dialect: 'mysql'
    }
);

seque.authenticate()
  .then(() => {
    console.log('Connection streesocialmasterdb has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database streesocialmasterdb: ', error);
  });

module.exports = seque;
