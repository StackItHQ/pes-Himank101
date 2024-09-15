const { readSheet, writeSheet } = require("./sheets");
const { readFromDb, writeToDb } = require("./database");

async function syncSheetToDb(sheetData, connection, tableName) {
  await connection.query(`TRUNCATE TABLE ${tableName}`);
  const data = sheetData.slice(1).map((row) => {
    const obj = {};
    sheetData[0].forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  await writeToDb(connection, tableName, data);
}

async function syncDbToSheet(sheets, spreadsheetId, range, dbData) {
  const headers = Object.keys(dbData[0]);
  const values = [
    headers,
    ...dbData.map((row) => headers.map((header) => row[header])),
  ];
  await writeSheet(spreadsheetId, sheets, range, values);
}

async function performSync(
  sheets,
  connection,
  spreadsheetId,
  range,
  tableName,
) {
  // Read from Google Sheets
  const sheetData = await readSheet(spreadsheetId, sheets, range);

  // Read from database
  const dbData = await readFromDb(connection, tableName);

  // Check for changes and sync
  if (
    JSON.stringify(sheetData) !==
    JSON.stringify(dbData.map((row) => Object.values(row)))
  ) {
    if (sheetData.length > dbData.length) {
      await syncSheetToDb(sheetData, connection, tableName);
    } else {
      await syncDbToSheet(sheets, spreadsheetId, range, dbData);
    }
  }
}

module.exports = { performSync };
