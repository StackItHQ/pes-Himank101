const mysql = require("mysql2/promise");

// Function to create a MySQL connection
async function createConnection(config) {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  return connection;
}

module.exports = createConnection;
