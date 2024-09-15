const mysql = require("mysql2");

// Create and export a connection to the database
const connection = mysql.createConnection({
  host: "localhost", // Replace with your SQL server host
  user: "root", // Replace with your database username
  password: "Himank@2214", // Replace with your database password
  database: "GSheetConnector", // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as ID:", connection.threadId);
});

module.exports = connection;
