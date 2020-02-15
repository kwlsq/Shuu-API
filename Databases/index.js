const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'Vincentius',
  password : 'Vincent1234',
  database : 'shuu',
  port     : 3306
});

module.exports = connection