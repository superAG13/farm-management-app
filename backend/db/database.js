const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "34.118.13.255",
  user: "user",
  password: "user",
  database: "farm",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

module.exports = connection;
