const { google } = require("googleapis");
const { readFromDb } = require("./database");
const { authorize } = require("./auth");
const createConnection = require("./db");
const { readSheet, writeSheet } = require("./sheets");

async function ensureConnection(mysqlConfig, connection) {
  console.log(mysqlConfig);
  if (!connection || connection.state === "disconnected") {
    console.log("Reconnecting to MySQL...");
    connection = await createConnection(mysqlConfig);
  }
  return connection;
}

// Poll the database and update Google Sheets if changes are found
async function pollDatabase(mysqlConfig, spreadsheetId) {
  let connection;
  let lastDbContent = "";

  try {
    connection = await createConnection(mysqlConfig);
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });
    const tableName = "users"; // Assuming the table name is 'users'

    setInterval(async () => {
      try {
        connection = await ensureConnection(mysqlConfig, connection);
        const dbData = await readFromDb(connection, tableName);

        // Convert dbData (array of objects) to a 2D array (rows of data)
        const headers = ["id", "name", "colour", "age", "job"];
        const dbSheetValues = [
          headers,
          ...dbData.map((row) => [
            row.id,
            row.name,
            row.colour,
            row.age,
            row.job,
          ]),
        ];

        // Stringify to compare changes
        const currentDbContent = JSON.stringify(dbSheetValues);

        // Check if data has changed
        if (currentDbContent !== lastDbContent) {
          console.log("Database change detected, updating Google Sheet...");
          lastDbContent = currentDbContent;

          // Update Google Sheet
          // const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${dbSheetValues.length + 1}`;
          const range = "A1:J100";
          await writeSheet(spreadsheetId, sheets, range, dbSheetValues);
        }
      } catch (error) {
        console.error("Error polling database:", error.message);
      }
    }, 5000); // Poll every 5 seconds
  } catch (error) {
    console.error("Error setting up database polling:", error.message);
  }
}

// Setup configuration and start polling
const mysqlConfig = {
  host: "192.168.0.102",
  username: "root",
  password: "Himank@2214",
  database: "GSheetConnector",
  tableName: "users",
};
const spreadsheetId = "1e5F-Nj7V6k2gUidvqJPmQ7uQUMuD4epgk-NZOjsIDGk"; // Google Sheet ID

pollDatabase(mysqlConfig, spreadsheetId);
