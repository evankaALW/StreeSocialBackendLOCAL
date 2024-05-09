const { Sequelize } = require('sequelize');
const connectionLocal = new Sequelize(
    'streesociallocaldb',
    'root',
    'Abc#12345',
    {
        host : 'localhost',
        dialect: 'mysql'
    }
);

connectionLocal.authenticate()
  .then(() => {
    console.log('Connection streesociallocaldb has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database streesociallocaldb: ', error);
  });

module.exports = connectionLocal;
