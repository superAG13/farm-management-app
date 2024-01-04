const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Dominik@1",
//   database: "farm",
// });

const connection = mysql.createConnection({
  host: "myfarmdb.c5uc0208cp1t.eu-north-1.rds.amazonaws.com",
  user: "admin",
  password: "Dominika1",
  database: "myfarmdb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

module.exports = connection;
