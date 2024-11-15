const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.usernameofsql,
  password: process.env.passwordofsql,
  database: process.env.databasename
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;