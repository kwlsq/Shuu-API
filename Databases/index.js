// const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'Vincentius',
//   password : 'Vincent1234',
//   database : 'shuu',
//   port     : 3306
// });

// module.exports = connection
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'vincentius',
  password: 'skeletonspyro',
  database: 'kwlsqxx',
  port: 3306
});

module.exports = connection