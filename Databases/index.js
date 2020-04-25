// const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'Vincentius',
//   password: 'Vincent1234',
//   database: 'shuu',
//   port: 3306
// });

// module.exports = connection
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bd3bbb02e22ae5',
  password: '1fc77ef7',
  database: 'heroku_2fc813c450ec87f',
  port: 3306
});

module.exports = connection

//Error 1227 (42000) waktu import (Super privilege) => hilangin yang berbau DEFINE di file .sql
//Error 1273 (HY000) => replace utf8mb4_0900_ai_ci jadi utf8mb4_general_ci di file .sql