

const mysql = require('mysql');
const util = require('util');
const config = require('./config');

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

const query = util.promisify(pool.query).bind(pool);


module.exports = {
  query, 
  pool, 
};
