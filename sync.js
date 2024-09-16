const { readSheet, writeSheet } = require("./sheets");
const { readFromDb, writeToDb } = require("./database");
const { authorize } = require("./auth");
const createConnection = require("./db");
const { google } = require("googleapis");

async function performSync(sheetData, connection, tableName) {
  // Clear the existing data in the database table
  await connection.query(`TRUNCATE TABLE ${tableName}`);
  // Insert new data from the Google Sheets
  const data = sheetData.slice(1).map((row) => ({
    id: row[0],
    name: row[1],
    colour: row[2],
    age: row[3],
    job: row[4],
  }));
  await writeToDb(connection, tableName, data);
}

async function ensureConnection(mysqlConfig, connection) {
  if (!connection || connection.state === "disconnected") {
    console.log("Reconnecting to MySQL...");
    connection = await createConnection(mysqlConfig);
  }
  return connection;
}

async function updateSheet(sheets, spreadsheetId, dbData) {
  const headers = ["id", "name", "colour", "age", "job"];
  const dbSheetValues = [
    headers,
    ...dbData.map((row) => headers.map((header) => row[header])),
  ];
  const newRange = `A1:${String.fromCharCode(65 + headers.length - 1)}${dbSheetValues.length}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: newRange,
    valueInputOption: "RAW",
    resource: { values: dbSheetValues },
  });

  console.log(
    `Updated Google Sheet with ${dbSheetValues.length - 1} rows from database`,
  );
}

async function setupTriggerListener(mysqlConfig, callback) {
  const connection = await createConnection(mysqlConfig);
  let lastProcessedId = 0;

  setInterval(async () => {
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM changelog WHERE id > ? ORDER BY id ASC LIMIT 100",
        [lastProcessedId],
      );

      if (rows.length > 0) {
        lastProcessedId = rows[rows.length - 1].id;
        await callback("database");
      }
    } catch (error) {
      console.error("Error checking changelog", error);
    }
  }, 1000); // Check every second
}

async function setupPolling(mysqlConfig, userInfo, spreadsheetId) {
  let connection;
  console.log(mysqlConfig);
  try {
    connection = await createConnection(mysqlConfig);
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });
    const range = "A1:E1000"; // Updated to match users table columns
    const tableName = "users"; // Assuming the table name is 'users'

    let lastSheetContent = "";

    // Set up interval to check for Google Sheets changes
    setInterval(async () => {
      try {
        const sheetData = await readSheet(spreadsheetId, sheets, range);
        const currentSheetContent = JSON.stringify(sheetData);

        if (currentSheetContent !== lastSheetContent) {
          console.log("Change detected in Google Sheet");
          lastSheetContent = currentSheetContent;
          await setupTriggerListener(mysqlConfig, () => { })("sheet");
        }
      } catch (error) {
        console.error("Error checking Google Sheet content:", error.message);
        if (error.errors && error.errors.length > 0) {
          console.error("Detailed error:", error.errors[0].message);
        }
      }
    }, 5000); // Check every 5 seconds
  } catch (error) {
    console.error("Error setting up polling:", error.message);
    if (error.errors && error.errors.length > 0) {
      console.error("Detailed error:", error.errors[0].message);
    }
  }
}

module.exports = { performSync, setupPolling };
