const { readSheet, writeSheet } = require("./sheets");
const { readFromDb, writeToDb } = require("./database");
const { authorize } = require("./auth");
const createConnection = require("./db");
const { google } = require("googleapis");

async function performSync(sheetData, connection, tableName) {
  // Clear the existing data in the database table
  await connection.query(`TRUNCATE TABLE ${tableName}`);

  // Insert new data from the Google Sheets
  const data = sheetData.slice(1).map((row) => {
    const obj = {};
    sheetData[0].forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  await writeToDb(connection, tableName, data);
}

// Function to handle reconnection logic
async function ensureConnection(mysqlConfig, connection) {
  if (!connection || connection.state === "disconnected") {
    console.log("Reconnecting to MySQL...");
    connection = await createConnection(mysqlConfig);
  }
  return connection;
}

// Function to poll for changes and sync both ways
async function setupPolling(mysqlConfig, userInfo, spreadsheetId) {
  let connection;
  console.log(mysqlConfig);
  try {
    connection = await createConnection(mysqlConfig);
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });
    // const spreadsheetId = spreadsheetId;
    const range = "A1:Z1000";
    const tableName = mysqlConfig.tableName;

    setInterval(async () => {
      try {
        connection = await ensureConnection(mysqlConfig, connection);
        const dbData = await readFromDb(connection, tableName);
        const sheetData = await readSheet(spreadsheetId, sheets, range);

        const headers = Object.keys(dbData[0]);
        const dbSheetValues = [
          headers,
          ...dbData.map((row) => headers.map((header) => row[header])),
        ];

        const sheetDbData = sheetData.slice(1).map((row) => {
          const obj = {};
          sheetData[0].forEach((header, i) => {
            obj[header] = row[i];
          });
          return obj;
        });

        // Compare row counts and data
        if (
          dbData.length !== sheetDbData.length ||
          JSON.stringify(dbData) !== JSON.stringify(sheetDbData)
        ) {
          if (
            dbData.length > sheetDbData.length ||
            (dbData.length === sheetDbData.length &&
              JSON.stringify(dbData) !== JSON.stringify(sheetDbData))
          ) {
            // Database has more rows or same number of rows but different data, update Sheet
            const newRange = `A1:${String.fromCharCode(65 + headers.length - 1)}${dbSheetValues.length}`;
            sheets.spreadsheets.values.update({
              spreadsheetId,
              range: newRange,
              valueInputOption: "RAW",
              resource: { values: dbSheetValues },
            });
            console.log(
              `Updated Google Sheet with ${dbSheetValues.length - 1} rows from database`,
            );
          } else {
            // Sheet has more rows or different data, update Database
            await performSync(sheetData, connection, tableName);
            console.log(
              `Updated database with ${sheetData.length - 1} rows from Google Sheet`,
            );
          }
        } else {
          console.log(
            "No changes detected. Both database and Google Sheet are in sync.",
          );
        }
      } catch (error) {
        console.error("Error during sync", error);
      }
    }, 5000); // 60 seconds interval
  } catch (error) {
    console.error("Error setting up polling", error);
  }
}
module.exports = { performSync, setupPolling };
