require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log(process.env.DB_HOST);  // Should print your DB host
console.log(process.env.DB_USER);  // Should print your DB username
console.log(process.env.DB_NAME)

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  dialect: 'mysql',
});

module.exports = sequelize;